const serialNumber = (word) => {
  let serial = '';
  alphabet = '123456789QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm';
  for (let i = 0; i < word.length; i++) {
    let random = Math.floor(Math.random() * alphabet.length)
    serial += alphabet[random]
  }
  return serial;
}




// Variables DOM
const categoryTitle = document.querySelector('.form-add-category input');
const formPaper = document.querySelector('.form-add-Paper');
// Store 
let storePaper = {
  fetchPaperCategory: () => {
    let categories = localStorage.getItem('paperCategory');
    return categories ? JSON.parse(categories) : []
  },
  savePaperCategory: (data) => {
    localStorage.setItem('paperCategory', JSON.stringify(data))
  },
  fetchPapers: () => {
    let papers = localStorage.getItem('papers');
    return papers ? JSON.parse(papers) : []
  },
  savePapers: (data) => {
    localStorage.setItem('papers', JSON.stringify(data))
  }
}
// Display Html 
function displayPaper(catId) {
  let papers = storePaper.fetchPapers();
  let content = '';
  for (let paper of papers) {
    if (paper.category == catId) {
      content +=`
        <div class="wall-item ${paper.done? 'done': ''}" >
          <p> <i class="fa fa-check"></i> ${paper.paper}</p>
          <div class="controls">
            <a class="delete" id="${paper.id}" onclick="deletePaper(this)">
              <i class="fa fa-times-circle"></i>
            </a>
            <a class="complete" id="${paper.id}" onclick="donePaper(this)">
              <i class="fa fa-check-circle"></i>
            </a>
          </div>
        </div>
      `
    }
  }
  return content ? content : '<div class="no-item">There is no item ! </div>';
}

function displayCount(catId){
  let papers = storePaper.fetchPapers();
  let all = papers.filter(paper => {
    return paper.category === catId
  })
  let done = all.filter(item => {
    return item.done !== false
  })
  return `
      <span class="count">
        <span class="len-all">${all.length}</span>
        <span class="len-done">${done.length}</span>
      </span>
      `
  
  ;
}
function displayCategories (){
  let categories = storePaper.fetchPaperCategory();
  let htmlCategories = '';
  for (let cat of categories) {
    htmlCategories += `
    <div class="wall-list" >
      <div class="wall-list-title">
      ${cat.category}
      ${displayCount(cat.id)}
      <i class="fa fa-times" onclick="deleteCategory(${cat.id})"></i>
    </div>
    <div class="wall-list-content" id=${cat.id}>
      ${displayPaper(cat.id)}
    </div>
    <div class="form-add-paper">
      <input type="hidden" name="" value="${cat.id}">
      <input type="text" placeholder="Add Paper">
      <button type="button" onclick="addPaper(this)">Save</button>
    </div>
  </div>`
  }
  document.querySelector('.wall').innerHTML = htmlCategories
}
window.addEventListener('DOMContentLoaded',()=>{
  displayCategories()
})

// Model Actions 
function closeModal() {
  document.querySelector('.modal').classList.remove('open');
}
function openModal() {
  document.querySelector('.modal').classList.add('open');
}


// addCategory
function addCategory() {
  let categories = storePaper.fetchPaperCategory();
  if (categoryTitle.value !== '') {
    categories.push({
      id: serialNumber(categoryTitle.value),
      category: categoryTitle.value
    })
    storePaper.savePaperCategory(categories) // Update data in localStorage
  }
  categoryTitle.value = '';
  closeModal()
  displayCategories(); // reRender Content
}
// deleteCategory
function deleteCategory(item) {
  let categories = storePaper.fetchPaperCategory();
  
  let newCategories =  categories.filter(category => {
    return category.id !== item.id
  })
  storePaper.savePaperCategory(newCategories); // Update data in localStorage
  displayCategories(); // reRender Content
}

// addPaper
function addPaper(element) {
  let papers = storePaper.fetchPapers();
  const paperValue = element.previousElementSibling; // Ref To Input 
  const categoryValue = paperValue.previousElementSibling.value; // Ref To Category Id 
  if (paperValue.value !== '') {
    papers.push({
      id: serialNumber(paperValue.value),
      paper: paperValue.value,
      category: categoryValue,
      done:false,
    })
    storePaper.savePapers(papers) // Update data in localStorage
  }
  paperValue.value = ''
  displayCategories(); // reRender Content
}

// deletePaper
function deletePaper(item){
  let papers = storePaper.fetchPapers();
  let newPapers = papers.filter(paper => {
    return paper.id !== item.id
  })
  storePaper.savePapers(newPapers); // Update data in localStorage
  displayCategories(); // reRender Content
  
}
function donePaper(item){
  item.style.textDecoration = 'line-through'
  let papers = storePaper.fetchPapers();
  papers.map(paper => {
    if(paper.id == item.id)
      paper.done = true; //
  })
  storePaper.savePapers(papers) // Update data in localStorage 
  displayCategories(); // reRender Content 
}
