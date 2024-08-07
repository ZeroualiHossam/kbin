from django.contrib import messages
from django.forms import IntegerField
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import logout
from django.urls import reverse
from .forms import ThreadForm, LinkForm, MagazineForm, CommentForm, UsuarioForm, UserForm
from .models import Magazine, Thread, Comment, User
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.db.models import Count
from django.db.models import F
from django.db.models import Q
from django.shortcuts import render, redirect
from django.utils import timezone
from .models import Thread, Magazine

def logout_view(request):
    logout(request)
    return redirect('/')

@login_required(login_url='/login/')
def SearchView(request):
    '''Vista para la búsqueda de threads'''
    now = timezone.now()
    query = request.GET.get('q', '')
    threads = None
    magazine_names = None
    filter_by = request.GET.get('filter_by')
    link_filter = request.GET.get('link_filter')

    if query:

        threads = Thread.objects.filter(Q(title__icontains=query) | Q(body__icontains=query))
        magazine_ids = threads.values_list('magazine_id', flat=True).distinct()
        magazine_names = Magazine.objects.filter(id__in=magazine_ids).values('id', 'name')

    if filter_by == 'newest':
        threads = threads.order_by('-created')
    elif filter_by == 'comentado':
        threads = threads.annotate(num_comments=Count('comments')).order_by('-num_comments')
    elif filter_by == 'destacado':
        threads = threads.annotate(upvotes_count=Count('upvotes'), downvotes_count=Count('downvotes')).annotate(difference=F('upvotes_count') - F('downvotes_count')).order_by('-difference')

    if link_filter == 'links':
        threads = threads.exclude(url=None)
    elif link_filter == 'threads':
        threads = threads.filter(Q(url='') | Q(url=None))

    context = {
        'threads': threads,
        'magazine_names': magazine_names,
        'now': now,
        'query': query,
        'filter_by': filter_by,
        'link_filter': link_filter
    }

    if request.method == 'POST' and request.user.is_authenticated:
        if 'thread_id' in request.POST:
            thread_id = request.POST['thread_id']
            thread = Thread.objects.get(pk=thread_id)
        if request.method == 'POST' and request.user.is_authenticated:
            if 'thread_id' in request.POST:
                thread_id = request.POST['thread_id']
                thread = Thread.objects.get(pk=thread_id)
                handle_thread_vote(request, thread)
                return HttpResponseRedirect(f'/search?q={query}')
        
    return render(request, "search.html", context)


def LoginView(request):
    '''Esto es la página de login'''
    return render(request, "login.html")

def RegisterView(request):
    '''Esto es la página de registro'''
    return render(request, "register.html")

def logout_view(request):
    '''Esto es la página de logout'''
    logout(request)
    return redirect("/")

def IndexView(request):
    '''Esto es la página principal'''
    now = timezone.now()
    threads = Thread.objects.all()
    
    filter_by = request.GET.get('filter_by')
    link_filter = request.GET.get('link_filter')
    if filter_by == None: filter_by = 'destacado'

    if filter_by == 'newest':
        threads = threads.order_by('-created')
    elif filter_by == 'comentado':
        threads = threads.annotate(num_comments=Count('comments')).order_by('-num_comments')
    elif filter_by == 'destacado':
        threads = threads.annotate(upvotes_count=Count('upvotes'), downvotes_count=Count('downvotes')).annotate(difference=F('upvotes_count') - F('downvotes_count')).order_by('-difference')

    if link_filter == 'links':
        threads = threads.exclude(url=None)
    elif link_filter == 'threads':
        threads = threads.filter(Q(url='') | Q(url=None))

    magazine_ids = threads.values_list('magazine_id', flat=True).distinct()
    magazine_names = Magazine.objects.filter(id__in=magazine_ids).values('id', 'name')
    
    if request.method == 'POST' and request.user.is_authenticated:
        if 'thread_id' in request.POST:
            thread_id = request.POST['thread_id']
            thread = Thread.objects.get(pk=thread_id)
            handle_thread_vote(request, thread)
            return redirect('index')

    context = {
        'threads': threads,
        'magazine_names': magazine_names,
        'now': now,
        'filter_by': filter_by,
        'link_filter': link_filter,
    }
    
    return HttpResponse(render(request, 'list_threads.html', context))


@login_required(login_url='/login/')
def LinkFormView(request):
    if request.method == 'POST':
        now = timezone.now()
        form = LinkForm(request.POST)
        if form.is_valid():
            link = form.save(commit=False)  # No guarda el objeto en la base de datos todavía
            link.created_by = request.user.usuario  # Asigna el usuario autenticado al atributo created_by
            link.created = now
            link.save()  # Ahora guarda el objeto en la base de datos
            return redirect('index')
    else:
        form = LinkForm()

    return render(request,'create_link.html',{'form': form})

@login_required(login_url='/login/')  # Aplica el decorador login_required para requerir autenticación (sino redirige al login)
def NewThreadView(request):
    if request.method == 'POST':
        now = timezone.now()
        form = ThreadForm(request.POST)
        if form.is_valid():
            thread = form.save(commit=False)  # No guarda el objeto en la base de datos todavía
            thread.created_by = request.user.usuario  # Asigna el usuario autenticado al atributo created_by
            thread.created = now
            thread.save()  # Ahora guarda el objeto en la base de datos
            return redirect('index')
    else:
        form = ThreadForm()
    return render(request, 'new_thread.html', {'form': form})


@login_required(login_url='/login/')
def MagazineFormView(request):
    if request.method == 'POST':
        form = MagazineForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('list_magazines')
    else:
        form = MagazineForm()

    return render(request,'create_magazine.html',{'form': form})

def ThreadView(request, thread_id):
    thread = get_object_or_404(Thread, pk=thread_id)
    form = CommentForm()
    comments = get_comments(thread, request)
    now = timezone.now()
    reply_to_comment_id = get_action_comment_id(request,'reply_to')
    edit_comment_id = get_action_comment_id(request, 'edit')

    if request.method == 'POST' and request.user.is_authenticated:
        handle_post_request(request, thread, now)
        edit_comment_id = None
    return render(request, 'view_thread.html', {'edit': edit_comment_id,'thread': thread, 'comments': comments, 'form': form, 'form_edit': get_edit_comment_form(request, edit_comment_id), 'now': now, 'reply_to_comment_id': reply_to_comment_id, 'level': 0})

def get_comments(thread, request):
    comments = thread.comments.filter(parent__isnull=True).order_by('-created')
    order = request.GET.get('order', '-created')
    if order == '-upvotes_count':
        comments = comments.annotate(upvotes_count=Count('upvotes')).order_by('-upvotes_count')
    else:
        comments = comments.order_by(order)
    
    return comments

def get_action_comment_id(request, action):
    comment_id = request.GET.get(action)
    return get_int_comment_id(comment_id)

def get_int_comment_id(comment_id):
    try:
        return int(comment_id)
    except (ValueError, TypeError):
        return None
    
def get_edit_comment_form(request, edit_comment_id):
    if edit_comment_id is not None and request.user.is_authenticated:
        comment = get_object_or_404(Comment, pk=edit_comment_id)
        if request.user.usuario == comment.user:
             return CommentForm(instance=comment, initial={'comment': comment.comment})
    return None

def handle_post_request(request, thread, now):
    if 'new_comment_submit' in request.POST:
        handle_new_comment_submit(request, thread, now)
    elif 'new_reply_submit' in request.POST:
        handle_new_reply_submit(request, thread, now)
    elif 'edit_comment_submit' in request.POST:
        handle_edit_comment_submit(request, thread)
    elif 'delete_comment_id' in request.POST:
        handle_delete_comment(request)
    elif 'comment_id' in request.POST:
        handle_comment_vote(request)
    elif 'thread_id' in request.POST:
        handle_thread_vote(request, thread)

def handle_new_comment_submit(request, thread, now):
    form = CommentForm(request.POST)
    if form.is_valid():
        new_comment = form.save(commit=False)
        new_comment.thread = thread
        new_comment.user = request.user.usuario
        new_comment.created = now
        new_comment.save()
        return redirect('view_thread', thread_id=thread.id)

def handle_new_reply_submit(request, thread, now):
    form = CommentForm(request.POST)
    comment_id = request.POST.get('comment_id')
    comment = get_object_or_404(Comment, pk=comment_id)
    if form.is_valid():
        new_reply = form.save(commit=False)
        new_reply.thread = thread
        new_reply.user = request.user.usuario
        new_reply.created = now
        new_reply.parent = comment
        new_reply.save()
        return redirect('view_thread', thread_id=thread.id)

def handle_edit_comment_submit(request, thread):
    comment_id = request.POST.get('comment_id')
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user.usuario == comment.user:
        form = CommentForm(request.POST, instance=comment)
        if form.is_valid():
            form.save()
            return redirect('view_thread', thread_id=thread.id)

def handle_comment_vote(request):
    comment_id = request.POST.get('comment_id')
    comment = get_object_or_404(Comment, pk=comment_id)
    if 'vote_up' in request.POST:
        handle_vote_up(request, comment)
    elif 'vote_down' in request.POST:
        handle_vote_down(request, comment)
    elif 'vote_impulsar' in request.POST:
        handle_impulse(request, comment)

def handle_thread_vote(request, thread):
    if 'vote_up' in request.POST:
        handle_vote_up(request, thread)
    elif 'vote_down' in request.POST:
        handle_vote_down(request, thread)
    elif 'vote_impulsar' in request.POST:
        handle_impulse(request, thread)

def handle_vote_up(request, obj):
    if request.user.usuario not in obj.upvotes.all():
        obj.upvotes.add(request.user.usuario)
        if request.user.usuario in obj.downvotes.all():
            obj.downvotes.remove(request.user.usuario)
    else:
        obj.upvotes.remove(request.user.usuario)
    obj.save()

def handle_impulse(request, obj):
    if request.user.usuario not in obj.impulsos.all():
        obj.impulsos.add(request.user.usuario)
    else:
        obj.impulsos.remove(request.user.usuario)
    obj.save()

def handle_vote_down(request, obj):
    if request.user.usuario not in obj.downvotes.all():
        obj.downvotes.add(request.user.usuario)
        if request.user.usuario in obj.upvotes.all():
            obj.upvotes.remove(request.user.usuario)
    else:
        obj.downvotes.remove(request.user.usuario)
    obj.save()

def handle_delete_comment(request):
    comment_id = request.POST.get('comment_id')
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user.is_authenticated and request.user.usuario == comment.user:
        comment.delete()

def MagazineListView(request):
    order = request.GET.get('order')
    magazines = Magazine.objects.all()
    if(order == None): order = "subscribers"
    if order == "threads":
        magazines = magazines.annotate(threads_count=Count('threads')).order_by('-threads_count')
    elif order == "comments":
        magazines = magazines.annotate(comment_count=Count('threads__comments')).order_by('-comment_count')
    else:
         magazines = magazines.annotate(subscriber_count=Count('subscribers')).order_by('-subscriber_count')
    magazine_sub = []
    for magazine in magazines:
        is_subscribed = magazine.is_subscribed(request.user) if request.user.is_authenticated else False
        magazine_sub.append((magazine, is_subscribed))

    return render(request, 'list_magazines.html', {'magazines': magazines, 'magazine_sub': magazine_sub, "order": order})

def MagazineView(request, magazine_name):
    magazine = get_object_or_404(Magazine, name=magazine_name)
    if request.user.is_authenticated: is_subscribed = magazine.is_subscribed(request.user)
    else: is_subscribed = False
    now = timezone.now()
    threads = Thread.objects.filter(magazine=magazine)
    
    filter_by = request.GET.get('filter_by')
    link_filter = request.GET.get('link_filter') 

    if filter_by == 'newest':
        threads = threads.order_by('-created')
    elif filter_by == 'comentado':
        threads = threads.annotate(num_comments=Count('comments')).order_by('-num_comments')
    elif filter_by == 'destacado':
        threads = threads.annotate(upvotes_count=Count('upvotes'), downvotes_count=Count('downvotes')).annotate(difference=F('upvotes_count') - F('downvotes_count')).order_by('-difference')

    if link_filter == 'links':
        threads = threads.exclude(url=None)
    elif link_filter == 'threads':
        threads = threads.filter(Q(url='') | Q(url=None))

    magazine_ids = threads.values_list('magazine_id', flat=True).distinct()
    magazine_names = Magazine.objects.filter(id__in=magazine_ids).values('id', 'name')
    
    context = {
        'threads': threads,
        'magazine': magazine,
        'is_subscribed':is_subscribed,
        'now': now,
        'filter_by': filter_by,
        'link_filter': link_filter,
        'magazine_names': None
    }
    if request.method == 'POST' and request.user.is_authenticated:
        if 'thread_id' in request.POST:
            thread_id = request.POST['thread_id']
            thread = Thread.objects.get(pk=thread_id)
            handle_thread_vote(request, thread)
            return redirect('view_magazine',magazine.name)
    
    return HttpResponse(render(request,'view_magazine.html',context))
    
@login_required(login_url='/login/')
def MagazineSubscribe(request, magazine_name):
    magazine = Magazine.objects.get(name=magazine_name)
    user = request.user
    if magazine in user.usuario.subscriptions.all():
        if request.method == 'POST':
            user.usuario.subscriptions.remove(magazine)
            return redirect(request.META.get('HTTP_REFERER', '/'))
    else:
        if request.method == 'POST':
            user.usuario.subscriptions.add(magazine)
            return redirect(request.META.get('HTTP_REFERER', '/'))

def UserProfileView(request, username):
    
    #Intenta obtenir el perfil basat en el username
    user_profile = get_object_or_404(User, username=username)
    option = request.GET.get('option')
    filter_by = request.GET.get('filter_by')
    link_filter = request.GET.get('link_filter') 
    if filter_by == None: filter_by = "destacado"
    if link_filter == None: link_filter = "all"
    if(option == None): option = 'threads'
    #Comprova si l'usuari loguejat és el mateix que el perfil
    is_own_profile = request.user.is_authenticated and (request.user == user_profile)
    
    usuari_consultat = user_profile.usuario
    count_comentaris = usuari_consultat.comments.count()
    count_threads = usuari_consultat.threads.count()
    count_boosted = usuari_consultat.impulse.count()
    if option == "threads" :
        threads = Thread.objects.filter(created_by=user_profile.usuario)
        if filter_by == 'newest':
            threads = threads.order_by('-created')
        elif filter_by == 'comentado':
            threads = threads.annotate(num_comments=Count('comments')).order_by('-num_comments')
        elif filter_by == 'destacado':
            threads = threads.annotate(upvotes_count=Count('upvotes'), downvotes_count=Count('downvotes')).annotate(difference=F('upvotes_count') - F('downvotes_count')).order_by('-difference')

        if link_filter == 'links':
            threads = threads.exclude(url=None)
        elif link_filter == 'threads':
            threads = threads.filter(Q(url='') | Q(url=None))
        
        now = timezone.now()
        magazine_ids = threads.values_list('magazine_id', flat=True).distinct()
        magazine_names = Magazine.objects.filter(id__in=magazine_ids).values('id', 'name')
    
        context = {
            'user_profile': user_profile, 
            'threads': threads,
            'magazine_names': magazine_names,
            'now': now,
            'count_comentaris': count_comentaris, 
            'count_threads': count_threads, 
            'is_own_profile': is_own_profile, 
            'count_boosted': count_boosted,
            'option' : option,
            'filter_by': filter_by,
            'link_filter': link_filter,
        }
        if request.method == 'POST' and request.user.is_authenticated:
            if 'thread_id' in request.POST:
                thread_id = request.POST['thread_id']
                thread = Thread.objects.get(pk=thread_id)
                handle_thread_vote(request, thread)
                url = reverse('view_user_profile', kwargs={'username': user_profile.username})
                url += f'?option={option}&filter_by={filter_by}&link_filter={link_filter}'
                return redirect(url)
        return render(request, "user_profile.html", context)
    elif option == "boosts": 
        threads = Thread.objects.filter(impulsos=user_profile.usuario)
        if filter_by == 'newest':
            threads = threads.order_by('-created')
        elif filter_by == 'comentado':
            threads = threads.annotate(num_comments=Count('comments')).order_by('-num_comments')
        elif filter_by == 'destacado':
            threads = threads.annotate(upvotes_count=Count('upvotes'), downvotes_count=Count('downvotes')).annotate(difference=F('upvotes_count') - F('downvotes_count')).order_by('-difference')

        if link_filter == 'links':
            threads = threads.exclude(url=None)
        elif link_filter == 'threads':
            threads = threads.filter(Q(url='') | Q(url=None))

        now = timezone.now()

        magazine_ids = threads.values_list('magazine_id', flat=True).distinct()
        magazine_names = Magazine.objects.filter(id__in=magazine_ids).values('id', 'name')
    
        context = {
            'user_profile': user_profile, 
            'threads': threads,
            'magazine_names': magazine_names,
            'now': now,
            'count_comentaris': count_comentaris, 
            'count_threads': count_threads, 
            'is_own_profile': is_own_profile, 
            'count_boosted': count_boosted,
            'option' : option,
            'filter_by': filter_by,
            'link_filter': link_filter,

        }
        if request.method == 'POST' and request.user.is_authenticated:
            if 'thread_id' in request.POST:
                thread_id = request.POST['thread_id']
                thread = Thread.objects.get(pk=thread_id)
                handle_thread_vote(request, thread)
                url = reverse('view_user_profile', kwargs={'username': user_profile.username})
                url += f'?option={option}&filter_by={filter_by}&link_filter={link_filter}'
                return redirect(url)
        return render(request, "user_profile.html", context)
    else:
        now = timezone.now()
        #comments = user_profile.usuario.comments.all()
        comments = get_comments_User(request, user_profile.usuario)
        form = CommentForm()
        reply_to_comment_id = get_action_comment_id(request,'reply_to')
        edit_comment_id = get_action_comment_id(request, 'edit')
        
        context = {
            'user_profile': user_profile, 
            'comments': comments, 
            'level': 0,
            'now': now,            
            'count_comentaris': count_comentaris, 
            'count_threads': count_threads, 
            'is_own_profile': is_own_profile, 
            'count_boosted': count_boosted,
            'option' : option,
            'form_edit': get_edit_comment_form(request, edit_comment_id),
            'reply_to_comment_id': reply_to_comment_id,
            'form': form
        }
        
        if request.method == 'POST' and request.user.is_authenticated:
            comentari = None
            comentari_id = request.POST.get('comment_id')
            
            if comentari_id != None : comentari = get_object_or_404(Comment, pk=comentari_id)
            elif reply_to_comment_id != None : comentari = context['comments'].get(id=reply_to_comment_id)
            
            elif edit_comment_id != None : comentari = context['comments'].get(id=edit_comment_id) 
                
            hilo = comentari.thread
            handle_post_request(request, hilo, now)
            url = reverse('view_user_profile', kwargs={'username': user_profile.username})
            url += f'?option={option}'
            return redirect(url)
        return render(request, "user_profile.html", context)    

def get_comments_User(request, usuario):
    comments = comments = Comment.objects.filter(Q(user=usuario, parent__isnull=True) |  # Comentarios principales del usuario
    Q(user=usuario, parent__isnull=False) & ~Q(parent__user=usuario)  # Respuestas a comentarios de otros usuarios
    ).order_by('-created')
    order = request.GET.get('order', '-created')
    if order == '-upvotes_count':
        comments = comments.annotate(upvotes_count=Count('upvotes')).order_by('-upvotes_count')
    else:
        comments = comments.order_by(order)
    
    return comments

@login_required(login_url='/login/')
def ProfileSettingsView(request):
    if request.method == 'POST':
        user_form = UserForm(request.POST, instance=request.user)
        usuario_form = UsuarioForm(request.POST, request.FILES, instance=request.user.usuario)
    
        if user_form.is_valid() and usuario_form.is_valid():
            user_form.save()
            usuario_form.save()
            messages.success(request, 'Your profile was successfully updated!')
            return redirect('/settings/profile/')
        
    else:
        user_form = UserForm(instance=request.user)
        usuario_form = UsuarioForm(instance=request.user.usuario)
    
    context = {
        'user_form': user_form, 
        'usuario_form': usuario_form
    }
    
    return render(request, "profile_setting.html", context)

@login_required(login_url='/login/')
def EditThreadView(request,thread_id):
    thread = get_object_or_404(Thread, id=thread_id)
    if request.user.is_authenticated and request.user.usuario == thread.created_by:
        if request.method == 'POST':
            now = timezone.now()
            form = ThreadForm(request.POST,instance=thread)
            if form.is_valid():
                thread = form.save(commit=False)  # No guarda el objeto en la base de datos todavía
                thread.created_by = request.user.usuario  # Asigna el usuario autenticado al atributo created_by
                thread.created = now
                thread.save()  # Ahora guarda el objeto en la base de datos
                return redirect('view_thread',thread_id)
        else:
            now = timezone.now()
            form = ThreadForm(instance=thread)
            context = {
                'thread': thread,
                'now': now,
                'form': form
            }
            return HttpResponse(render(request, "edit_thread.html", context))
    return redirect(request.META.get('HTTP_REFERER', '/'))

@login_required(login_url='/login/')
def DeleteThread(request,thread_id):
    thread = get_object_or_404(Thread, id=thread_id)
    if request.user.is_authenticated and request.user.usuario == thread.created_by:
        if request.method == 'POST':
                if request.user.is_authenticated and request.user.usuario == thread.created_by:
                    thread.delete()
                    if '/thread/' in request.META.get('HTTP_REFERER', ''):
                        return redirect('index')
                    else:
                        return redirect(request.META.get('HTTP_REFERER', '/'))

    return redirect(request.META.get('HTTP_REFERER', '/'))
