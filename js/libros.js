document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const booksContainer = document.getElementById('booksContainer');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterGenre = document.getElementById('filterGenre');
    const filterYear = document.getElementById('filterYear');
    const filterRating = document.getElementById('filterRating');
    
    // Store all books data
    let allBooks = [];
    
    // Function to load CSV data
    function loadBooks() {
        Papa.parse('data/libros.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                allBooks = results.data;
                
                // Process data and fill filters
                processData();
                
                // Display all books
                displayBooks(allBooks);
            },
            error: function(error) {
                booksContainer.innerHTML = '<p class="error">Error al cargar los libros. Por favor, intenta de nuevo.</p>';
                console.error('Error loading CSV:', error);
            }
        });
    }
    
    // Process data and populate filters
    function processData() {
        const genres = new Set();
        const years = new Set();
        
        allBooks.forEach(book => {
            // Process genres
            if (book.genero) {
                book.genero.split(',').forEach(genre => {
                    genres.add(genre.trim());
                });
            }
            
            // Process years
            if (book.año) {
                years.add(book.año);
            }
            
            // Ensure rating is a number
            book.valoracion = book.valoracion ? Number(book.valoracion) : 0;
        });
        
        // Fill genre filter
        [...genres].sort().forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            filterGenre.appendChild(option);
        });
        
        // Fill year filter
        [...years].sort((a, b) => b - a).forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            filterYear.appendChild(option);
        });
    }
    
    // Display books
    function displayBooks(books) {
        if (!books || books.length === 0) {
            booksContainer.innerHTML = '<p class="no-results">No se encontraron libros que coincidan con los criterios de búsqueda.</p>';
            return;
        }
        
        booksContainer.innerHTML = '';
        
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            // Generate star rating
            const stars = '★'.repeat(Math.floor(book.valoracion)) + '☆'.repeat(5 - Math.floor(book.valoracion));
            
            // Create tags from genres
            let tagsHTML = '';
            if (book.genero) {
                tagsHTML = book.genero.split(',').map(genre => 
                    `<span class="book-tag">${genre.trim()}</span>`
                ).join('');
            }
            
            // Create cover image or placeholder
            let coverHTML = '';
            if (book.portada && book.portada.trim() !== '') {
                coverHTML = `<img src="${book.portada}" alt="${book.titulo}">`;
            } else {
                coverHTML = book.titulo || 'Sin título';
            }
            
            bookCard.innerHTML = `
                <div class="book-cover">${coverHTML}</div>
                <div class="book-info">
                    <h3 class="book-title">${book.titulo || 'Sin título'}</h3>
                    <p class="book-author">${book.autor || 'Autor desconocido'}</p>
                    <div class="book-rating">${stars}</div>
                    <p class="book-year">${book.año || ''}</p>
                    <div class="book-tags">${tagsHTML}</div>
                </div>
            `;
            
            booksContainer.appendChild(bookCard);
        });
    }
    
    // Filter books
    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const genreFilter = filterGenre.value;
        const yearFilter = filterYear.value;
        const ratingFilter = Number(filterRating.value);
        
        const filteredBooks = allBooks.filter(book => {
            // Search term
            const matchesSearch = 
                !searchTerm || 
                (book.titulo && book.titulo.toLowerCase().includes(searchTerm)) || 
                (book.autor && book.autor.toLowerCase().includes(searchTerm));
            
            // Genre
            const matchesGenre = 
                !genreFilter || 
                (book.genero && book.genero.toLowerCase().includes(genreFilter.toLowerCase()));
            
            // Year
            const matchesYear = 
                !yearFilter || 
                book.año === yearFilter;
            
            // Rating
            const matchesRating = 
                !ratingFilter || 
                book.valoracion >= ratingFilter;
            
            return matchesSearch && matchesGenre && matchesYear && matchesRating;
        });
        
        displayBooks(filteredBooks);
    }
    
    // Event listeners
    searchBtn.addEventListener('click', filterBooks);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterBooks();
        }
    });
    
    filterGenre.addEventListener('change', filterBooks);
    filterYear.addEventListener('change', filterBooks);
    filterRating.addEventListener('change', filterBooks);
    
    // Load books on page load
    loadBooks();
});
