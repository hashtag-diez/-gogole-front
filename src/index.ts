import { Book } from "./types.js"


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

// Build books
export const buildBook = (img: string, title: string, author: string, theme: string, bookId: number) => {
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
            ul.appendChild(buildBook(book.imagepath, title, authors ? authors.name : "Auhtor undefined" , "theme", book.id))      
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
                ul.appendChild(buildBook(book.imagepath, title, authors ? authors.name : "Auhtor undefined" , "theme", book.id))      
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

// Onclick h2
const h2 = document.querySelector("h2")
h2?.addEventListener("click", () => {
    window.location.href = "/";
})