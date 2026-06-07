


import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

def search_music_by_url(url):
    """Extrai a cifra usando Selenium para aguardar o carregamento do JavaScript"""
    
    # Configuração do Chrome
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Executa sem interface gráfica
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    # A partir do Selenium 4.6+, o Selenium Manager cuida do ChromeDriver automaticamente
    driver = webdriver.Chrome(options=options)
    
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
        titulo = soup.title.text if soup.title else "Título não encontrado"
        
        # Extrai a cifra
        cifra = soup.find("div", class_="cifra_cnt")
        
        if not cifra:
            print("Cifra não encontrada!")
            return None
        
        return {
            "titulo": titulo,
            "cifra": cifra.get_text()
        }

            
    except Exception as e:
        print(f"Erro ao carregar a página: {e}")
        return None
        
    finally:
        driver.quit()
