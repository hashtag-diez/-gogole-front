import { Book } from "./types.js"

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

const buildBook = (img: string, title: string, author: string, theme: string, bookId: number) => {
    const book = document.createElement("li")
    const image = document.createElement("img")
    const legend  = document.createElement("legend")
    const bookTitle = document.createElement("span")
    const bookAuthor = document.createElement("span")
    // const bookTheme = document.createElement("span")
    bookTitle.className = "titre"
    bookTitle.textContent = title
    bookAuthor.className = "author"
    bookAuthor.textContent = author
    // bookTheme.className = "theme"
    // bookTheme.textContent = theme
    legend.appendChild(bookAuthor)
    legend.appendChild(bookTitle)
    // legend.appendChild(bookTheme)
    image.src = img
    image.addEventListener("click", () => redirectToBookPage(bookId))
    book.appendChild(image)
    book.appendChild(legend)
    return book
}

const redirectToBookPage = (bookId: number) => {
    const bookPageUrl = `./src/pages/book.html?bookId=${bookId}`;
    window.location.href = bookPageUrl;
}

let page = 1
let maxPages: number = -1
const ul = document.querySelector("ul")
const fetchBooks = async () => {
    const res = await fetch("http://localhost:3333/books/?page="+page)
    const books = await res.json()
    if (maxPages == -1) maxPages = books[1]/9
    if(ul!=null) {
        books[0].forEach((book: Book) => {
            const authors = JSON.parse(book.author)[0]
            ul.appendChild(buildBook(book.imagepath, book.title, authors ? authors.name : "Auhtor undefined" , "theme", book.id))      
        });
    } 
}

const fetchBooksSearch = async (query: string) => {
    const res = await fetch("http://localhost:3333/search/?query="+query)
    const books = await res.json()
    if(ul!=null) {
        ul.innerHTML = ""
        books.forEach((book: Book) => {
            const authors = JSON.parse(book.author)[0]
            ul.appendChild(buildBook(book.imagepath, book.title, authors ? authors.name : "Auhtor undefined" , "theme", book.id))      
        });
    }
}

window.addEventListener("load", fetchBooks)
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