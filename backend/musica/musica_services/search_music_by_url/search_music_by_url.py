


import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time


# def search_music_by_url(url=None):
#     try:
#         # Fazendo a requisição
#         response = requests.get(url)
#         response.raise_for_status()  # Levanta exceção para códigos de erro HTTP
#         html = response.text

#         # Analisando o HTML
#         soup = BeautifulSoup(html, "html.parser")

#         # Extraindo o título da página
#         titulo = soup.title.text if soup.title else "Título não encontrado"
#         print("Título da página:", titulo)

#         # Extraindo a cifra da tag <div>
#         cifra = soup.find("div", class_="cifra_cnt")
#         if not cifra:
#             print("Cifra não encontrada.")
#             return None
        
#         return {
#             "titulo": titulo,
#             "cifra": cifra.get_text()
#         }
        
#     except requests.exceptions.RequestException as e:
#         print(f"Erro na requisição HTTP: {str(e)}")
#         return None
#     except Exception as e:
#         print(f"Erro inesperado: {str(e)}")
#         return None

def search_music_by_url(url):
    """Extrai a cifra usando Selenium para aguardar o carregamento do JavaScript"""
    
    # Configuração do Chrome
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Executa sem interface gráfica
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    # Instala e configura o ChromeDriver automaticamente
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        print("Acessando a página...")
        driver.get(url)
        
        # Aguarda até 10 segundos para o conteúdo carregar
        print("Aguardando o carregamento da cifra...")
        wait = WebDriverWait(driver, 10)
        
        # Aguarda o elemento da cifra aparecer
        wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "cifra_cnt"))
        )
        
        # Aguarda um pouco mais para garantir que todo o conteúdo foi carregado
        time.sleep(2)
        
        # Extrai o HTML da página após o carregamento
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        
        # Extrai o título da página
        titulo = soup.title.text
        print("Título da página:", titulo)
        
        # Extrai a cifra
        cifra = soup.find("div", class_="cifra_cnt")
        if cifra:
            print("Cifra encontrada!")
            print("Conteúdo da cifra:")
            # print(cifra.get_text())
            return cifra.get_text()
        else:
            print("Cifra não encontrada.")
            return None
            
    except Exception as e:
        print(f"Erro ao carregar a página: {e}")
        return None
        
    finally:
        driver.quit()
