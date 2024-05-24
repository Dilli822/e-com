# orders/management/commands/extract_orders.py

from django.core.management.base import BaseCommand
from masterDummy.tasks import extract_and_store_orders  # Import the extraction function

class Command(BaseCommand):
    help = 'Extracts orders and stores them in OrderArchive'

    def handle(self, *args, **kwargs):
        extract_and_store_orders()
        self.stdout.write(self.style.SUCCESS('Successfully extracted and stored orders'))
