import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    """Advanced filtering for products"""
    
    min_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='iexact')
    material = django_filters.CharFilter(field_name='materials__name', lookup_expr='icontains')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    is_customizable = django_filters.BooleanFilter(field_name='is_customizable')
    product_type = django_filters.ChoiceFilter(choices=Product.PRODUCT_TYPE_CHOICES)
    
    class Meta:
        model = Product
        fields = ['category', 'product_type', 'is_customizable', 'is_featured']
    
    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock_quantity__gt=0)
        return queryset