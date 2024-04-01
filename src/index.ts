import { Book } from "./types.js"
import { getCompletion } from "./auto-completion.js";


// Debounce function
const debounce = (callback: (args: any) => void, delay: number = 1000) => {
    let timoutId: ReturnType<typeof setTimeout>;
    return function (this: any, event: Event){
        clearTimeout(timoutId);
        timoutId = setTimeout(() => callback.call(this,event), delay);
    }
}

const input = document.querySelector('input[type="search"]');
input?.addEventListener('input', debounce(async (event: Event) => {
    const target = event.target as HTMLInputElement
    if(target.value.length ==0) {
        if(ul!=null) ul.innerHTML = ""
        page=1
        fetchBooks()
    }
    else {
        fetchBooksSearch(target.value)
    }
    
}))
input?.addEventListener('keydown', (e: any) => {
    if(e.key === 'Enter') {
        e.preventDefault()
        fetchBooksSearch(e.target.value)
    }
})

// Build books
export const buildBook = (img: string, title: string, author: string, bookId: number) => {
    const book = document.createElement("li")
    const image = document.createElement("img")
    const legend  = document.createElement("legend")
    const bookTitle = document.createElement("span")
    const bookAuthor = document.createElement("span")
    bookTitle.className = "titre"
    bookTitle.textContent = title
    bookAuthor.className = "author"
    bookAuthor.textContent = author
    legend.appendChild(bookAuthor)
    legend.appendChild(bookTitle)
    image.src = img
    image.addEventListener("click", () => redirectToBookPage(bookId))
    book.appendChild(image)
    book.appendChild(legend)
    return book
}

let page = 1
const ul = document.querySelector("ul")
const fetchBooks = async () => {
    const res = await fetch("http://localhost:3333/books/?page="+page)
    const books = await res.json()
    if(ul!=null && books.length>0) {
        books.forEach((book: Book) => {
            const authors = JSON.parse(book.author)[0]
            const title = book.title.length > 30 ? book.title.slice(0, 30) + "..." : book.title
            ul.appendChild(buildBook(book.imagepath, title, authors ? authors.name : "Auhtor undefined" , book.id))      
        });
    } 
}
const main = document.querySelector("main")
const loading = document.querySelector("span[class='loading']")
const fetchBooksSearch = async (query: string) => {
    if (ul!=null) ul.innerHTML = ""
    if (loading!=null){
        loading.textContent = "Loading..."
        main?.appendChild(loading)
        const res = await fetch("http://localhost:3333/search/?query="+query)
        const books = await res.json()
        if(ul!=null && books.length>0) {
            books.forEach((book: Book) => {
                const authors = JSON.parse(book.author)[0]
                const title = book.title.length > 30 ? book.title.slice(0, 30) + "..." : book.title
                ul.appendChild(buildBook(book.imagepath, title, authors ? authors.name : "Auhtor undefined" , book.id))      
            });
        }
        loading.innerHTML = ""
    }
}

// Redirect to book page
export const redirectToBookPage = (bookId: number) => {
    const bookPageUrl = `/src/pages/book.html?bookId=${bookId}`;
    window.location.href = bookPageUrl;
}

window.addEventListener("load", () =>{
    if(input!=null && (input as HTMLInputElement).value.length>0) fetchBooksSearch((input as HTMLInputElement).value)
    else fetchBooks()
    setUpSearchInputListener()
})
const showmoreButton = document.querySelector("button")
showmoreButton?.addEventListener("click", () => {
    page++
    fetchBooks()
})
window.addEventListener("scroll", () => {
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        page++
        fetchBooks()
    }
})

// Onclick h2
const h2 = document.querySelector("h2")
h2?.addEventListener("click", () => {
    window.location.href = "/";
})

const setUpSearchInputListener = () => {
    // search input id is search
    const searchInput: HTMLInputElement = document.querySelector("#search") as HTMLInputElement
    let previousValue: string = searchInput.value;
    let completions: string[] = [];
    searchInput.addEventListener('input', async (event: Event) => {
        const currentValue: string = searchInput.value;
        if (currentValue.length == 3) {
            // première requette d'autocomplétion (3 caractères)
            completions = await getCompletion(currentValue)
            return;
        }

        if (currentValue.length < 3) {
            // on vide les suggestions
            completions = [];
            return;
        }
        
        if (currentValue.length > previousValue.length) {
            console.log("forward");
            // filter completions
            completions = completions.filter((completion: string) => completion.startsWith(currentValue))
        } else {
            console.log("backward");
            completions = await getCompletion(currentValue)
        }
        previousValue = currentValue;
        const searchInputCompletionElement: HTMLInputElement = document.querySelector("#words") as HTMLInputElement
        completions.forEach((completion: string) => {
            const option = document.createElement("option")
            option.value = completion
            searchInputCompletionElement.appendChild(option)
        })
    })
}

