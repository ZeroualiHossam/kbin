from django.contrib import admin
from django.urls import path, include
import AppASW.views as views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('login/', views.LoginView),
    path('register/', views.RegisterView),
    path('search/', views.SearchView, name = 'search'),
    path('logout', views.logout_view, name='logout'),
    path('', views.IndexView,name = 'index'),
    path('new/link/', views.LinkFormView,name = 'create_link'), 
    path('new/thread/', views.NewThreadView, name = 'new_thread'),
    path('new/magazine/', views.MagazineFormView,name = 'create_magazine'),
    path('thread/<int:thread_id>/', views.ThreadView, name = 'view_thread'), 
    path('thread/<int:thread_id>/edit', views.EditThreadView, name = 'edit_thread'), 
    path('thread/<int:thread_id>/delete', views.DeleteThread, name = 'delete_thread'), 
    path('thread/<int:thread_id>/', views.ThreadView, name = 'view_thread'), 
    path('magazine/', views.MagazineListView,name = 'list_magazines'), 
    path('m/<str:magazine_name>', views.MagazineView, name = 'view_magazine'),
    path('m/<str:magazine_name>/subscribe', views.MagazineSubscribe, name = 'magazine_subscribe'),
    path('u/<str:username>/', views.UserProfileView, name = 'view_user_profile'),
    path('settings/profile/', views.ProfileSettingsView, name = 'profile_settings'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
