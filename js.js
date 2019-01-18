const $form = document.querySelector('#form')
const $block = document.querySelector('.block')
const $img = document.querySelector('#img')
const $picture = document.querySelector('#picture')
const $main = document.querySelector('#main')
const $main_p = document.querySelector('#main_p')
const $question = document.querySelector('#question')
const $list = document.querySelector('#list')
const $button = document.querySelector('#btn')

const quest = document.createElement('h2')
const form = document.createElement('form')
const num = document.createElement('div')

quest.classList.add('quest')
form.classList.add('ans_list')

$question.appendChild(quest)
$question.appendChild(form)

let num_of_questions = 7

let i = 1;
function test(event) {
    event.preventDefault()
    const num_checked = form.querySelectorAll('input:checked')
    if (i!==1)
        if (num_checked.length > 0) {
            const id_num_checked = []
            for (let j=0; j<num_checked.length; j++)
                id_num_checked.push(parseInt(num_checked[j].id))
            const answer = {
                number: i-1,
                choice: id_num_checked
            }
            answers.push(answer)
            quiz(event)
        }
        else {
            alert("there are not checked elements")
        }
    else 
        quiz(event)
}

function addCath(recomendation) {
    const cath = document.createElement('div')
    const logo = document.createElement('div')
    const img = document.createElement('img')
    const title = document.createElement('h2')
    const link_block = document.createElement('div')
    const vk = document.createElement('h3')
    const link = document.createElement('a')
    const description = document.createElement('p')

    cath.classList.add('cath')
    logo.classList.add('logo')
    img.classList.add('img')
    title.classList.add('title')
    link_block.classList.add('link_block')
    vk.classList.add('vk')
    link.classList.add('link')
    description.classList.add('description')

    $block.appendChild(cath)
    cath.appendChild(logo)
    logo.appendChild(img)
    cath.appendChild(title)
    cath.appendChild(link_block)
    link_block.appendChild(vk)
    link_block.appendChild(link)
    cath.appendChild(description)

    img.src = recomendation.logo
    title.textContent = `${recomendation.title} (${recomendation.abbr})`
    vk.textContent = 'Ссылка:'
    link.href = recomendation.link
    link.target = '_blank'
    link.textContent = recomendation.link
    description.textContent = recomendation.description
}

const recomURL = 'http://pm-pu.ru/quest-dept/result.php'
function getRecom(answers, callback) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', recomURL)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE &&
        xhr.status === 200) {
            callback(xhr.responseText)
        }
    }
    xhr.send(`query=${JSON.stringify(answers)}`)
}

const answers = []

function BuildFinishPage(responseText) {
    const recomendations = JSON.parse(responseText).recomendations
    $block.textContent = ''
    const results = document.createElement('h1')
    results.classList.add('results')
    $block.appendChild(results)
    results.textContent = 'Результаты:'
    for (let j in recomendations) {
        addCath(recomendations[j])
    }

    const btn = document.createElement('button')
    $block.appendChild(btn)
    btn.textContent = "Пройти ещё раз"
    btn.addEventListener('click', function() {
        window.location.reload()
    })
}

function quiz(event) {
    event.preventDefault()
    
    if (i === 1) {
        $main.remove()
        $main_p.remove()
        $list.remove()
        num.classList.add('num')
        $block.appendChild(num)
        $button.textContent = "Следующий вопрос"
    }
    num.textContent = `${i}/${num_of_questions}`
    if (i === num_of_questions) {
        $button.textContent = "Завершить"
    }
    if (i > num_of_questions) {
        getRecom(answers, BuildFinishPage)
    }
    else {
        $img.src = `img/${i}.jpg`
        form.textContent = ""


        const QuizURL = 'http://pm-pu.ru/quest-dept/?q=' + i;
        const xhr = new XMLHttpRequest()
        xhr.open('GET', QuizURL)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE &&
            xhr.status === 200) {
                const JSONString = JSON.parse(xhr.responseText)
                quest.textContent = JSONString.result.question
                for (let j=0; j<JSONString.result.answers.length; j++) {
                    const answer = document.createElement('label')
                    const input = document.createElement('input')
                    const text = document.createElement('span')
                    if (JSONString.result.type === "multiplaychoice") {
                        input.setAttribute('type', 'checkbox')
                        input.setAttribute('name', 'check')
                    }
                    else {
                        input.setAttribute('type', 'radio')
                        input.setAttribute('name', 'radio')
                    }
                    input.setAttribute('id', j)
                    answer.appendChild(input)
                    answer.appendChild(text)
                    form.appendChild(answer)
                    text.textContent = JSONString.result.answers[j]
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "preview"])
                }
            }
        }
        xhr.send() 
    }   
    i++
}

$form.addEventListener('submit', test)
