const KEY = '429793e2'

const listRoot = document.querySelector('#search-root')
const form = document.querySelector('#movie-search')
let storedMovies = []


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = form.querySelector('input')
    if (!input.value.trim()) {
        return
    }

    getListData(input.value)
    input.value = ''
})

async function getListData(searchTerm) {
    const url = `https://www.omdbapi.com/?s=${searchTerm}&plot=full&apikey=${KEY}`
    const response = await fetch(url)
    const data = await response.json()
    createDetailedListData(data)

}





async function createDetailedListData(data) {
    listRoot.innerHTML = ''
    if (data.Error) {
        renderEmpty()
    }

    const detailedMovieData = await Promise.all(data.Search.map(async (movie) => {
        const url = `https://www.omdbapi.com/?i=${movie.imdbID}&plot=short&apikey=${KEY}`
        const response = await fetch(url)
        const movieData = await response.json()
        return movieData

    }))

    renderListData(detailedMovieData)


}

function renderEmpty() {
    const emptyListHTML = `
            <section class="empty">
                <p>
                    Unable to find what you're looking for. Please try
                    another search
                </p>
            </section>
        `
    const emptyListElement = document.createRange().createContextualFragment(emptyListHTML)
    listRoot.append(emptyListElement)
    return
}


function renderListData(data) {
    const renderedListHTML = data.map((movieData) => {
        return `
            <div class="movie">
                <img src="${movieData.Poster}" alt="movie poster" />
                <h2 class="title">
                    ${movieData.Title}
                    <span class="rating"
                        ><i class="star fa-solid fa-star"></i>${movieData.imdbRating}</span
                    >
                </h2>
                <div class="details">
                    <span class="duration">${movieData.Runtime}</span>
                    <span class="genre">${movieData.Genre}</span>
                    <button data-add-movie-id=${movieData.imdbID} class="btn btn-transparent">
                        <i class="fa-solid fa-circle-plus"></i>Watchlist
                    </button>
                </div>
                <p class="description">${movieData.Plot}</p>
            </div>
        `
    }).join('')

    const renderedListSectionString = `<section class="movie-list">${renderedListHTML}</section>`

    const renderedListSectionELem = document.createRange().createContextualFragment(renderedListSectionString)

    listRoot.append(renderedListSectionELem)

    document.addEventListener('click', (e) => {
        if (e.target.dataset.addMovieId) {
            const movieId = e.target.dataset.addMovieId
            storeMovie(data, movieId)
        }
    })
}

function storeMovie(data, id) {

    const movie = data.find((movie) => {
        return movie.imdbID === id
    })

    // console.log(movie)

    const existingData = JSON.parse(localStorage.getItem('movies'))
    const movieCollection = []

    console.log(existingData)

    if (!existingData) {
        movieCollection.push(movie)
        return localStorage.setItem('movies', JSON.stringify(movieCollection))
    }

    const existingMovie = existingData.find((m) => {
        return m.imdbID === movie.imdbID
    })

    if (existingMovie) {
        showModal()
        return
    }
    existingData.push(movie)
    localStorage.setItem('movies', JSON.stringify(existingData))

}


function showModal() {
    const modalEl = document.querySelector('#modal')
    modalEl.setAttribute('data-toggle-visible', '')
    setTimeout(() => {
        modalEl.removeAttribute('data-toggle-visible')
    }, 1000)
}



