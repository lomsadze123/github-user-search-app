const body = document.body;
const switchBtn = document.getElementById('switch');
const storage = localStorage.getItem('darkmode');
const all = document.getElementsByTagName("*");
const username = document.getElementById('username');
const section = document.querySelector('.section');
const about = document.querySelector('.about');
const sun = document.querySelector('.none');
const moon = document.querySelector('.hide');
const form = document.getElementById('form');
const firstName = document.getElementById('name');
const img = document.getElementById('img');
const nickname = document.getElementById('nickname');
const bios = document.getElementById('bio');
const join = document.getElementById('join');
const repo = document.getElementById('repo');
const followers = document.getElementById('followers');
const following = document.getElementById('following');
const address = document.getElementById('address');
const link = document.querySelectorAll('.link');
const blog = document.getElementById('link');
const company = document.getElementById('company');
const twitter = document.getElementById('twitter');
const empty = document.getElementById('empty');

let textColor = '';

if (storage === 'Dark-Mode') {
    enable();
}

function enable() {
    body.classList.add('darkMode');
    about.classList.add('darkMode');
    username.classList.add('darkModeSecond');
    section.classList.add('darkModeSecond');
    textColor = 'white';
    switchBtn.children[0].textContent = "light";
    sun.style.display = "block";
    moon.style.display = "none";
    nickname.textColor = "#0079FF";
    color();
}

function disable() {
    body.classList.remove('darkMode');
    username.classList.remove('darkModeSecond');
    about.classList.remove('darkMode');
    section.classList.remove('darkModeSecond');
    switchBtn.children[0].textContent = 'dark';
    textColor = '';
    sun.style.display = "none";
    moon.style.display = "block";
    color()
}

function color() {
    for (let i of all) {
        i.style.color = textColor;
        username.style.color = "white"
        if(i.id === 'nickname') i.style.color = '#0079FF'
        if(i.id === 'empty') i.style.color = '#F74646'
        if(i.tagName === 'path') i.style.fill = textColor;
    }
}

function toggle() {
    if(body.classList.contains('darkMode')) {
        disable();
        localStorage.removeItem('darkmode');
    } else {
        enable();
        localStorage.setItem('darkmode',"Dark-Mode");
    }
}

switchBtn.addEventListener('click', toggle);




form.addEventListener('submit', (event) => {
    if (username.value === '') {
        username.placeholder = "";
        empty.style.display = 'block';
        setTimeout(() => {
            empty.style.display = 'none';
          }, 1500);
        event.preventDefault();
        return;
      }
    event.preventDefault();
    const api = async () => {
        try {
            const url = await fetch('https://api.github.com/users/' + username.value);
            const data = await url.json();

            if(data.message === "Not Found") {
                empty.textContent = "No results";
                empty.style.display = 'block';
                setTimeout(() => {
                    empty.style.display = 'none';
                }, 1500);
                return
            }

            nickname.textContent = '@' + username.value;
            if(data.name === null) firstName.textContent = username.value;
            else firstName.textContent = data.name;

            img.src = data.avatar_url;

            if(data.bio === null) bios.textContent = "This profile has no bio";
            else bios.textContent = data.bio;

            const monthNumber = (data.created_at).split('-');
            const monthName = new Date(2000, monthNumber[1] - 1).toLocaleString('default', { month: 'short' });
            join.textContent = `Joined ${monthNumber[2].slice(0,2)} ${monthName} ${monthNumber[0]}`

            repo.textContent = data.public_repos;
            followers.textContent = data.followers;
            following.textContent = data.following;


            const linkChange = (data, element, index, href = null) => {
                if (data === null || data === "") {
                  element.textContent = 'Not Available';
                  link[index].style.opacity = 0.5;
                  if (href !== null) {
                    element.href = "#";
                  }
                } else {
                  if(element.id === "twitter") element.textContent = '@' + data;
                  else element.textContent = data;
                  link[index].style.opacity = 1;
                  if (href !== null && element.id === "twitter") element.href = href;
                  else element.href = data;
                }
            }
              linkChange(data.location, address, 0);
              linkChange(data.blog, blog, 1, 'blog');
              linkChange(data.company, company, 3, 'undefined');
              linkChange(data.twitter_username, twitter, 2, 'https://twitter.com/'+data.twitter_username);


        } catch (error) {
            console.log(error);
        }
    }
    api();
});

