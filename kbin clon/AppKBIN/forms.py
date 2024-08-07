from django import forms
from .models import Thread, Magazine, Comment, Usuario, User

class LinkForm(forms.ModelForm):
    class Meta:
        model = Thread
        fields = ['url','title','body','magazine']
        widgets = {
            'url': forms.URLInput(), 
            'title': forms.Textarea(attrs={'maxlength': 255, 'style': 'height: 66px;', 'placeholder': 'El títol no pot tenir més de 255 caracters'}),
            'body': forms.Textarea(attrs={'maxlength': 35000, 'style': 'hidden; height: 66px;', 'placeholder': 'El cos no pot tenir més de 35000 caracters'}),
            'magazine': forms.Select(attrs={'placeholder': 'Select a magazine'})
        }
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        choices = [(None,'Select a magazine')]
        choices.extend((magazine.id, magazine.name) for magazine in Magazine.objects.all())
        self.fields['magazine'].choices = choices


class ThreadForm(forms.ModelForm):
    class Meta:
        model = Thread
        fields = ['title', 'body','magazine']
        error_messages = {
            'title': {
                'max_length': "The title can't be larger than 255 characters."
            },
            'body': {
                'max_length': "The body can't be larger than 35000 characters."
            }
        }
        widgets = {
            'title': forms.Textarea(attrs={'maxlength': 255, 'style': 'height: 66px;', 'placeholder': "The title can't be larger than 255 characters."}),
            'body': forms.Textarea(attrs={'maxlength': 35000, 'style': 'hidden; height: 66px;', 'placeholder': "The body can't be larger than 35000 characters."}),
            'magazine': forms.Select(attrs={'placeholder': 'Select a magazine'})

        } 
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        choices = [(None,'Select a magazine')]
        choices.extend((magazine.id, magazine.name) for magazine in Magazine.objects.all())
        self.fields['magazine'].choices = choices

class MagazineForm(forms.ModelForm):
    class Meta:
        model = Magazine
        fields = ['name','title','description','rules']
        widgets = {
            'name': forms.TextInput(attrs={'maxlength': 25, 'style': 'height: 66px;', 'placeholder': 'El nom no pot tenir més de 25 caracters'}), 
            'title': forms.TextInput(attrs={'maxlength': 50, 'style': 'height: 66px;', 'placeholder': 'El títol no pot tenir més de 50 caracters'}),
            'description': forms.Textarea(attrs={'maxlength': 10000, 'style': 'hidden; height: 66px;', 'placeholder': 'La descripció no pot tenir més de 10000 caracters'}),
            'rules': forms.Textarea(attrs={'maxlength': 10000, 'style': 'hidden; height: 66px;', 'placeholder': 'Rules no pot tenir més de 10000 caracters'})

        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment 
        fields = ['comment']
        error_messages = {
            'comment': {
                'max_length': "The comment can't be larger than 50000 characters."
            }
        }
        widgets = {
            'comment': forms.Textarea(attrs={'maxlength': 50000, 'style': 'hidden; height: 66px;', 'placeholder': "The comment can't be larger than 50000 characters."})
        }
        
class UsuarioForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ['bio','avatar','cover']
        widgets = {
            'bio': forms.Textarea(attrs={'maxlength': 512, 'style': 'height: 66px;', 'placeholder': 'About'}), 
        }

class UserForm(forms.ModelForm):
    username = forms.CharField(required=True)
    class Meta:
        model = User
        fields = ['username']
        widgets = {
            'username': forms.TextInput(attrs={'maxlength': 15}),
        }