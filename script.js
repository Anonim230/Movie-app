append = (array, mother) => array.map(item => mother.appendChild(item))
$ = tag => document.querySelector(tag)
var { log } = console,
maxPage = 0,
    searchParams = {
        text: 'iron',
        page: 1,
        year: 2013
    },
    url = "https://www.omdbapi.com/?apikey=47068b0",
    foundFilms = []
    // catcher = event => {
    //     log(event.target, event.srcELement)
    //     if (!event.srcELement) event.target.src = './notFound.png'
    //     return false
    // }
onkeydown = event => event.key == 'Enter' ? submitter(event) : ''
pageValue = (current, max) => {
    if (max == 0) {
        pages.className = 'd-none'
        return false
    }
    pages.classList.remove('d-none')
    spanPage.value = current
    spanAllPages.innerHTML = max
    return true
}
submitter = event => {
    log(event)
    if (event.type == 'submit') event.preventDefault()
    let children = searchForm.children
    if (!children.searchName.value) return false
    searchParams.page = 1
    searchParams.text = children.searchName.value
    if (children.searchYear.value.length == 4) searchParams.year = children.searchYear.value
    else searchParams.year = ''
    getMovies()
    log(event.target)
}
searchForm.onsubmit = submitter
createUrl = () => {
    let returnable = url
    Object.entries(searchParams).map(val => {
        if (val[1]) {
            switch (val[0]) {
                case 'text':
                    returnable += '&s=' + searchParams[val[0]].split(' ').join('+')
                    break;
                case 'page':
                    returnable += '&page=' + val[1]
                    break;
                case 'year':
                    returnable += searchParams[val[0]] ? '&y=' + searchParams[val[0]] : ''
            }
        }
    })
    log(returnable)
    return returnable
}
createFilm = film => {
    let filmDiv = document.createElement('a'),
        thumb = document.createElement('img'),
        body = document.createElement('div'),
        title = document.createElement('h5'),
        year = document.createElement('div'),
        type = document.createElement('div')
    filmDiv.className = 'card my-2 mx-3 text-decoration-none'
    if (film.Poster != 'N/A') thumb.src = film.Poster
    else thumb.src = './notFound.png'
        // thumb.onerror = catcher
    filmDiv.href = 'https://imdb.com/title/' + film.imdbID
    thumb.height = 400
    thumb.width = 300
    thumb.className = 'card-img.top border-2'
    body.className = 'card-body text-black'
    title.innerHTML = film.Title
    filmDiv.style.width = "300px"
    title.className = 'card-title h5'
    year.innerHTML = film.Year
    year.className = 'h6 text-secondary'
    type.innerHTML = film.Type
    type.className = 'h5 text-capitalize'
    append([thumb, body], filmDiv)
    append([title, year, type], body)
    main.appendChild(filmDiv)
}
var getMovies = (searchUrl = createUrl()) => {
    log(searchUrl)
    main.innerHTML = ''
    fetch(searchUrl)
        .then(response => {
            response.json()
                .then(val => {
                    log(val)
                    if (val.Response == "False") {
                        main.innerHTML = "<h1 class='text-danger h1'>Error 404: film not found</h1>"
                        pageValue(0, 0)
                        return false
                    }
                    maxPage = Math.ceil(val.totalResults / 10)
                    foundFilms = val.Response ? val.Search : []
                    foundFilms.map(val => {
                        createFilm(val)
                    })
                    pageValue(searchParams.page, maxPage)
                })
        })
}
getMovies()
onkeyup = event => {
    if (event.key == 'Enter') return true
    if (event.key == 'Backspace') return true
    if (event.target.id == 'spanPage' && !isNaN(+event.key)) {
        let val = +event.target.value
        if (val > maxPage) searchParams.page = maxPage
        else if (val < 1) searchParams.page = 1
        else searchParams.page = val
        getMovies()
        return true
    }
    // log(event.code)
    if (main.children[0].className == 'text-danger h1') return ''
    if (event.code == "ArrowRight") {
        searchParams.page = searchParams.page >= maxPage ? 1 : searchParams.page + 1
        getMovies()
    } else if (event.code == "ArrowLeft") {
        searchParams.page = searchParams.page <= 1 ? maxPage : searchParams.page - 1
        getMovies()
    }
    pageValue(searchParams.page, maxPage)
}
spanPage.onfocus = event => event.target.value = ''
    // pageChangeByInput = target => {
    //     if (+target.value < 1) {
    //         target.value = maxPage
    //     } else if (+target.value > maxPage) {
    //         target.value = 1
    //     }
    //     page = target.value
    //     getMovies()
    //     return true
    // }
$('#searchYear').onkeydown = event => {
    let val = event.target.value
    if (val.length < 4 && !isNaN(+event.key)) {
        event.target.value = val
        return true
    }
    if (val.length == 4 && +val > 2022 || +val < 1930) event.target.value = ''
    if (event.key == 'Backspace') return true
    return false
}