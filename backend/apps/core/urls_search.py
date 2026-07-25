from django.urls import path
from .views_search import GlobalSearchView

urlpatterns = [
    path('global/', GlobalSearchView.as_view(), name='global-search'),
]
