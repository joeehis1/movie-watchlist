const storedData = JSON.parse(localStorage.getItem('movies'))
const listRoot = document.querySelector('#watchlist-root')


function render(data) {
    listRoot.innerHTML = ''
    if (!data || data.length === 0) {
        renderEmpty()
        return
    }

    renderWatchList(data)
}

function renderEmpty() {
    const emptyListHTML = `
            <section class="empty">
                <p>Your watchlist is looking a little empty...</p>
                <a class="btn btn-transparent" href="/index.html"
                    ><i class="fa-solid fa-circle-plus"></i>Lets add
                    some movies</a
                >
            </section>
        `
    const emptyListElement = document.createRange().createContextualFragment(emptyListHTML)
    listRoot.append(emptyListElement)
    return
}

function renderWatchList(data) {

    listRoot.innerHTML = ''

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
                    <button data-remove-movie-id=${movieData.imdbID} class="btn btn-transparent">
                        <i class="fa-solid fa-circle-minus"></i>Remove
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
        if (e.target.dataset.removeMovieId) {
            const movieId = e.target.dataset.removeMovieId
            removeMovie(data, movieId)
        }
    })
}

function removeMovie(data, movieId) {

    const filtered = data.filter((movie) => {
        return movie.imdbID !== movieId
    })
    localStorage.setItem('movies', JSON.stringify(filtered))
    render(filtered)
}

render(storedData)

