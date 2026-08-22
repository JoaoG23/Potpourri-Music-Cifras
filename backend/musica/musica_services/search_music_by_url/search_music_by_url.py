import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


def _find_cifra_element(driver):
    """Tenta localizar o elemento da cifra usando diferentes seletores de layout."""
    # 1º tentativa: estrutura com pre e atributo data-chord-content
    elementos = driver.find_elements(By.XPATH, "//pre[@data-chord-content='true']")
    if elementos:
        return elementos[0]

    # 2º tentativa: estrutura com div contendo tags b com data-chord-name
    elementos = driver.find_elements(By.XPATH, "//div[.//b[@data-chord-name]]")
    if elementos:
        return elementos[0]

    # 3º tentativa: fallback para classe legada cifra_cnt
    elementos = driver.find_elements(By.XPATH, "//div[contains(@class, 'cifra_cnt')]")
    if elementos:
        return elementos[0]

    # 4º tentativa: qualquer tag pre presente na página
    elementos = driver.find_elements(By.XPATH, "//pre")
    if elementos:
        return elementos[0]

    return None


def search_music_by_url(url):
    """Extrai a cifra usando Selenium com headless moderno e seletores resilientes"""

    # Configuração moderna do Chrome
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')  # Novo modo headless (mais realista e difícil de ser bloqueado)
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    driver = webdriver.Chrome(options=options)

    try:
        print("Acessando a página...")
        driver.get(url)

        print("Aguardando o carregamento da cifra...")
        wait = WebDriverWait(driver, 15)

        # Aguarda até que algum dos seletores de cifra esteja presente na página
        cifra_element = wait.until(_find_cifra_element)

        # Aguarda brevemente para renderização completa de acordes e scripts
        time.sleep(1)

        # Extrai o título da página
        titulo = driver.title if driver.title else "Título não encontrado"

        # Extrai o texto da cifra (innerText preserva as quebras de linha e tabulação do pre/div)
        cifra_text = cifra_element.get_attribute("innerText") or cifra_element.text

        if not cifra_text.strip():
            print("Cifra encontrada mas com conteúdo vazio!")
            return None

        return {
            "titulo": titulo,
            "cifra": cifra_text
        }

    except Exception as e:
        print(f"Erro ao carregar a página: {e}")
        return None

    finally:
        driver.quit()

