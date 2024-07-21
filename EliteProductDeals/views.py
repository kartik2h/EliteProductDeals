import json
import os
from django.utils import timezone

import pandas as pd
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import redirect, get_object_or_404
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from pyexpat.errors import messages
from rest_framework import status

from . import settings
from .models import Product, UserRating, User, UserDailyVisit
from django.views import View

from .forms import UserRegistrationForm, UserRatingForm, CustomPasswordResetForm, ContactForm
from .utils import generate_random_password, send_password_reset_email


def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('main')  # Redirect to your home page
    else:
        form = AuthenticationForm()
    return render(request, 'register.html', {'form': form})



def main(request):
    # Query all products from the database
    today = timezone.now().date()
    session_key = f"visited_{today}"
    context = {
        'products': Product.objects.order_by('-created_at')[:8],
        'form': ContactForm(request.POST or None)
    }

    # if request.user.is_authenticated:
    #     user_visit, created = UserDailyVisit.objects.get_or_create(
    #         user=request.user, date=today,
    #         defaults={'visits': 0}
    #     )
    #     if not request.session.get(session_key):
    #         user_visit.visits += 1
    #         user_visit.save()
    #         request.session[session_key] = True
    #
    #     # Context data only for authenticated users
    #     context.update({
    #         'user_visits_today': user_visit.visits,
    #         'total_user_visits': UserDailyVisit.objects.filter(user=request.user).aggregate(Sum('visits'))[
    #                                  'visits__sum'] or 0,
    #         'total_visits_today': UserDailyVisit.objects.filter(date=today).aggregate(Sum('visits'))[
    #                                   'visits__sum'] or 0,
    #         'total_visits_all_time': UserDailyVisit.objects.aggregate(Sum('visits'))['visits__sum'] or 0,
    #         'user': request.user  # Passing the user object to the template
    #     })

    if request.method == 'POST' and context['form'].is_valid():
        data = context['form'].cleaned_data
        file_path = os.path.join(settings.EXCEL_FILES_DIR, 'contacts.xlsx')
        df = pd.read_excel(file_path) if os.path.exists(file_path) else pd.DataFrame(
            columns=['name', 'email', 'phone', 'message'])
        new_data = pd.DataFrame([data])
        df = pd.concat([df, new_data], ignore_index=True)
        df.to_excel(file_path, index=False)
        return redirect('main')

    return render(request, 'EcoFriendlyProducts/index.html', context)


@login_required
def viewAllProducts(request):
    # Query all products from the database
    products = Product.objects.all()

    # Pass the products to the template
    context = {
        'products': products
    }

    return render(request, 'EcoFriendlyProducts/shop.html',context)


def shop(request):
    query = request.GET.get('q')
    if query:
        products = Product.objects.filter(Q(name__icontains=query) | Q(description__icontains=query))
        no_results = not products.exists()  # Check if the filtered queryset is empty
    else:
        products = Product.objects.all()
        no_results = False  # Always false when not searching

    context = {
        'products': products,
        'query': query,
        'no_results': no_results  # Pass this flag to the template
    }
    return render(request, 'EcoFriendlyProducts/shop.html', context)


def product_list(request):
    products = Product.objects.prefetch_related('userrating_set').all()
    return render(request, 'EcoFriendlyProducts/products.html', {'products': products})


def user_logout(request):
    logout(request)
    return redirect('login')


@csrf_exempt
def add_product(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product = Product(
                name=data.get('name'),
                description=data.get('description'),
                price=data.get('price'),
                eco_certification=data.get('eco_certification'),
                category=data.get('category'),
                brand=data.get('brand'),
                weight=data.get('weight'),
                dimensions=data.get('dimensions'),
                material=data.get('material'),
                manufacturing_location=data.get('manufacturing_location'),
                packaging_type=data.get('packaging_type'),
                recyclable=data.get('recyclable', False),
                biodegradable=data.get('biodegradable', False),
                cruelty_free=data.get('cruelty_free', False),
                energy_efficient=data.get('energy_efficient', False),
                image_url=data.get('image_url'),
                link=data.get('link')
            )
            product.save()
            return JsonResponse({'message': 'Product created successfully ID: ' + str(product.id)}, status=status.HTTP_201_CREATED)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@csrf_exempt
def modify_product(request, product_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            product = get_object_or_404(Product, id=product_id)
            product.name = data.get('name', product.name)
            product.description = data.get('description', product.description)
            product.price = data.get('price', product.price)
            product.eco_certification = data.get('eco_certification', product.eco_certification)
            product.category = data.get('category', product.category)
            product.brand = data.get('brand', product.brand)
            product.weight = data.get('weight', product.weight)
            product.dimensions = data.get('dimensions', product.dimensions)
            product.material = data.get('material', product.material)
            product.manufacturing_location = data.get('manufacturing_location', product.manufacturing_location)
            product.packaging_type = data.get('packaging_type', product.packaging_type)
            product.recyclable = data.get('recyclable', product.recyclable)
            product.biodegradable = data.get('biodegradable', product.biodegradable)
            product.cruelty_free = data.get('cruelty_free', product.cruelty_free)
            product.energy_efficient = data.get('energy_efficient', product.energy_efficient)
            product.image_url = data.get('image_url', product.image_url),
            product.link = data.get('link', product.link)
            product.save()
            return JsonResponse({'message': 'Product updated successfully! ID: ' + str(product.id)},
                                status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@csrf_exempt
def delete_product(request, product_id):
    if request.method == 'DELETE':
        try:
            product = get_object_or_404(Product, id=product_id)
            product.delete()
            return JsonResponse({'message': 'Product deleted successfully!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@method_decorator(csrf_exempt, name='dispatch')
class AddRatingView(View):
    def post(self, request):
        data = json.loads(request.body)
        user = get_object_or_404(User, id=data['user_id'])
        product = get_object_or_404(Product, id=data['product_id'])
        rating = data.get('rating')
        review_title = data.get('review_title', '')
        review_text = data.get('review_text', '')
        verified_purchase = data.get('verified_purchase', False)

        UserRating.objects.create(
            user=user,
            product=product,
            rating=rating,
            review_title=review_title,
            review_text=review_text,
            verified_purchase=verified_purchase
        )

        return JsonResponse({'message': 'Rating added successfully'}, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class ModifyRatingView(View):
    def put(self, request, rating_id):
        data = json.loads(request.body)
        rating = get_object_or_404(UserRating, id=rating_id)

        rating.rating = data.get('rating', rating.rating)
        rating.review_title = data.get('review_title', rating.review_title)
        rating.review_text = data.get('review_text', rating.review_text)
        rating.verified_purchase = data.get('verified_purchase', rating.verified_purchase)

        rating.save()

        return JsonResponse({'message': 'Rating modified successfully'}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class DeleteRatingView(View):
    def delete(self, request, rating_id):
        rating = get_object_or_404(UserRating, id=rating_id)
        rating.delete()
        return JsonResponse({'message': 'Rating deleted successfully'}, status=200)


class ProductReviewsView(View):
    def get(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        ratings = UserRating.objects.filter(product=product)

        total_rating = sum([r.rating for r in ratings])
        average_rating = total_rating / len(ratings) if ratings else 0

        reviews = [{
            'user': rating.user.username,
            'rating': rating.rating,
            'review_title': rating.review_title,
            'review_text': rating.review_text,
            'verified_purchase': rating.verified_purchase,
            'created_at': rating.created_at
        } for rating in ratings]

        return JsonResponse({
            'average_rating': average_rating,
            'reviews': reviews
        }, status=200)


def product_detail(request, product_id):
    product = Product.objects.get(id=product_id)
    reviews = UserRating.objects.filter(product=product)
    is_user_added_review = UserRating.objects.filter(product=product,
                                                     user=request.user).exists() if request.user.is_authenticated else False
    return render(request, 'EcoFriendlyProducts/product_details.html', {'product': product, 'reviews': reviews, 'isUserAddedReview': is_user_added_review})


@login_required
def add_review(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    if request.method == 'POST':
        form = UserRatingForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.product = product
            review.verified_purchase = True  # or any logic to determine if purchase is verified
            review.save()
            return redirect('product_detail', product_id=product_id)
    else:
        form = UserRatingForm()
    return redirect('product_detail', product_id=product_id)


def forgot_password(request):
    if request.method == 'POST':
        form = CustomPasswordResetForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            try:
                user = User.objects.get(email=email)
                new_password = generate_random_password(8, 20)
                send_password_reset_email(email, new_password)
                user.set_password(new_password)
                user.save()
                return render(request, 'EcoFriendlyProducts/forgot_password.html', {
                    'form': form,
                    'success_message': 'A password reset email has been sent to the provided email address.'
                })
            except User.DoesNotExist:
                form.add_error('email', 'No account found with that email address.')
    else:
        form = CustomPasswordResetForm()

    return render(request, 'EcoFriendlyProducts/forgot_password.html', {'form': form})


def forgot_password_view(request):
    form = CustomPasswordResetForm()
    return render(request, 'EcoFriendlyProducts/forgot_password.html', {'form': form})

def testPage(request):
    return render(request, 'EcoFriendlyProducts/product_details.html')