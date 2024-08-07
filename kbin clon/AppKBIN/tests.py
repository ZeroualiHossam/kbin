from django.test import TestCase, Client
from .models import Thread,Magazine

class ThreadTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_crear_thread(self):
        """
        Test para verificar correcta creación de thread
        """
        self.client.post('/new/magazine/', {'name': 'revista', 'title': 'titulo de la revista'})
        magazine = Magazine.objects.get(name='revista')
        self.assertTrue(Magazine.objects.filter(name='revista').exists())
        response = self.client.post('/new/thread/', {'title': 'Título del hilo', 'body': 'Cuerpo del hilo','magazine':magazine.id})
        self.assertEqual(response.status_code, 302)  # Verifica que la vista redirija correctamente
        self.assertTrue(Thread.objects.filter(title='Título del hilo').exists())  # Verifica que el objeto se haya creado en la base de datos

    def test_crear_thread_sense_body(self):
        """
        Test para verificar correcta creación de thread
        """
        self.client.post('/new/magazine/', {'name': 'revista', 'title': 'titulo de la revista'})
        self.assertTrue(Magazine.objects.filter(name='revista').exists())
        magazine = Magazine.objects.get(name='revista')
        response = self.client.post('/new/thread/', {'title': 'Título del hiloo','magazine':magazine.id})
        self.assertEqual(response.status_code, 302)  # Verifica que la vista redirija correctamente
        self.assertTrue(Thread.objects.filter(title='Título del hiloo').exists())  # Verifica que el objeto se haya creado en la base de datos

    def test_max_length_title(self):
        """
        Test para verificar que se supera el máximo de caracteres en el título.
        """
        self.client.post('/new/magazine/', {'name': 'revista', 'title': 'titulo de la revista'})
        magazine = Magazine.objects.get(name='revista')
        title = 'a' * 256  # Genera un título con más de 255 caracteres
        response = self.client.post('/new/thread/', {'title': title, 'body': 'Cuerpo del hilo','magazine': magazine.id})
        self.assertContains(response, "El títol no pot tenir més de 255 caracters.")  # Verifica el mensaje de error
        self.assertEqual(Thread.objects.filter(title=title).exists(), False) # Verifica que no se haya creado el objeto
        
    def test_max_length_body(self):
        """
        Test para verificar que se supera el máximo de caracteres en el cuerpo.
        """
        self.client.post('/new/magazine/', {'name': 'revista', 'title': 'titulo de la revista'})
        magazine = Magazine.objects.get(name='revista')
        body = 'a' * 35001  # Genera un cuerpo con más de 35000 caracteres
        response = self.client.post('/new/thread/', {'title': 'Título del hilo', 'body': body,'magazine': magazine.id})
        self.assertContains(response, "El cos no pot tenir més de 35000 caracters.")  # Verifica el mensaje de error
        self.assertEqual(Thread.objects.filter(body=body).exists(), False) # Verifica que no se haya creado el objeto