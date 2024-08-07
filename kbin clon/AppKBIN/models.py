from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Magazine(models.Model):
    name = models.CharField(max_length=25,unique=True)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=10000,blank=True,null=True)
    rules = models.CharField(max_length=10000,blank=True,null=True)
    def is_subscribed(self,user):
        return self.subscribers.filter(user=user).exists()
        
    def total_comments_count(self):
        total_comments = 0
        for thread in self.threads.all():
            total_comments += thread.comments.count()
        return total_comments

class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(null=True, blank=True)
    cover = models.ImageField(upload_to='covers', null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars', null=True, blank=True)
    subscriptions = models.ManyToManyField(Magazine, related_name='subscribers')

    def __str__(self):
        return str(self.user)

@receiver(post_save, sender=User)
def create_usuario(sender, instance, created, **kwargs):
    if created:
        Usuario.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_usuario(sender, instance, **kwargs):
    instance.usuario.save()


class Thread(models.Model):
    url = models.URLField(null = True)
    title = models.CharField(max_length=255)
    body = models.CharField(max_length=35000,blank = True,null = True)
    created = models.DateTimeField()
    impulsos = models.ManyToManyField(Usuario, related_name='impulse', blank=True)
    magazine = models.ForeignKey(Magazine,on_delete=models.CASCADE, related_name= 'threads')
    created_by = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='threads')
    upvotes = models.ManyToManyField(Usuario, related_name='upvoted_comments', blank=True)
    downvotes = models.ManyToManyField(Usuario, related_name='downvoted_comments', blank=True)


class Comment(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='comments') #Desde usuario accederias con Usuario.comments, comments es el no,bre de la relación. Puesta de esta manera un Usuario tiene muchos comments
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    comment = models.CharField(max_length=50000)
    created = models.DateTimeField()
    upvotes = models.ManyToManyField(Usuario, related_name='upvoted_users', blank=True) #Relación Muchos a Muchos. blank = true significa que puede estar vacio
    downvotes = models.ManyToManyField(Usuario, related_name='downvoted_users', blank=True) #En la base de datos se creará una nueva tabala asociativa donde guarda el par (comment, usuario) indicando que ha votado x tipo 
    impulsos = models.ManyToManyField(Usuario, related_name='boosted_comments', blank=True)