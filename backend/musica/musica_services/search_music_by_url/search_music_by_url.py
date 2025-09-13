


import requests
from bs4 import BeautifulSoup


def search_music_by_url(url=None):
    try:
        # Fazendo a requisição
        response = requests.get(url)
        response.raise_for_status()  # Levanta exceção para códigos de erro HTTP
        html = response.text

        # Analisando o HTML
        soup = BeautifulSoup(html, "html.parser")

        # Extraindo o título da página
        titulo = soup.title.text if soup.title else "Título não encontrado"
        print("Título da página:", titulo)

        # Extraindo a cifra da tag <div>
        cifra = soup.find("div", class_="cifra_cnt")
        if not cifra:
            print("Cifra não encontrada.")
            return None
        
        return {
            "titulo": titulo,
            "cifra": cifra.get_text()
        }
        
    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição HTTP: {str(e)}")
        return None
    except Exception as e:
        print(f"Erro inesperado: {str(e)}")
        return None

