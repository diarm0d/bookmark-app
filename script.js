const bookmarkButton = document.getElementById('bookmark-toggle');
const exitBookmark = document.getElementById('exit-button');
const dropdownBookmark = document.getElementById('dropdown-bookmark');
const bookmarkIcon = document.getElementById('dropdown-icon');
const removeBookmark = document.getElementsByClassName('remove');
const bookmarkItem = document.getElementsByClassName('item');
const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('exit-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl =document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];


function bookmarkList() {
    if (bookmarkIcon.classList.contains('fa-plus')) {
        showModal();
    } else {
    dropdownBookmark.hidden = false;
    bookmarkIcon.classList.replace('fa-bookmark', 'fa-plus');
}
}

function removeList() {
    dropdownBookmark.hidden = true;
}

// Show Modal, focus on input
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}



//Event listener
bookmarkButton.addEventListener('click', bookmarkList);
// exitBookmark.addEventListener('click', removeList);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    // Valid
    return true;
}

//build bookmarks DOM
function buildBookmarks() {
    dropdownBookmark.textContent = '';
    //build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        // item
        const item = document.createElement('div');
        item.classList.add('item');
        // favicon / link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // close div
        const remove = document.createElement('div');
        remove.classList.add('remove');
        // close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-trash-alt');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //Append to container
        linkInfo.append(favicon, link);
        remove.append(closeIcon);
        linkInfo.append(remove);
        item.append(linkInfo);
        dropdownBookmark.appendChild(item);
    })
    addExitButton();
}

function addExitButton() {
    const itemExit = document.createElement('div');
    itemExit.classList.add('item-exit');
    const nameExit = document.createElement('div');
    nameExit.classList.add('name-exit');
    const exitButton = document.createElement('i');
    exitButton.classList.add('fas', 'fa-times-circle');
    exitButton.id = 'exit-button';
    nameExit.append(exitButton);
    itemExit.append(nameExit);
    dropdownBookmark.appendChild(itemExit);
    itemExit.addEventListener('click', removeList);
}

// Fetch bookmarks
function fetchBookmarks() {
    // get bookmarks if available 
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'CDS',
                url: 'https://stackoverflow.com/questions/12361616/add-class-to-first-child-using-javascript',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks array in local storage, repopulate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }
    // Validate
   if  (!validate(nameValue, urlValue)) {
       return false;
   }
   const bookmark = {
       name: nameValue,
       url: urlValue,
   };
   bookmarks.push(bookmark);
   console.log(bookmarks);
   localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
   fetchBookmarks();
   bookmarkForm.reset();
   websiteNameEl.focus();
}

bookmarkForm.addEventListener('submit', storeBookmark);


// on load, fetch local storage
fetchBookmarks();