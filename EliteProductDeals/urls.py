"""
URL configuration for EliteProductDeals project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from EliteProductDeals import views, settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path('accounts/login/', views.user_login, name='login'),  # Default login view
    path('home/', views.main, name='main'),
    path('', views.main, name='main'),
    path('viewAllProducts/', views.viewAllProducts, name='view-all-products'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('add-product/', views.add_product, name='add-product'),
    path('modify-product/<int:product_id>/', views.modify_product, name='modify-product'),
    path('delete-product/<int:product_id>/', views.delete_product, name='delete-product'),
    path('products/', views.product_list, name='product_list'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('product/<int:product_id>/add_review/', views.add_review, name='add_review'),
    path('password_reset/', views.forgot_password, name='password_reset'),
    path('forgot_password/', views.forgot_password_view, name='forgot_password_view'),
    path('testpage', views.testPage, name='test'),
    path('shop/', views.shop, name='shop'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

