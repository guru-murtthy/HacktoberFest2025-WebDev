var score = 0;
var timer = 60;
var hitrn;
var tl = gsap.timeline();
var cursor = document.querySelector("#bubble");
var main = document.querySelector("#main2");

main.addEventListener('mousemove', function(details){
    gsap.to(cursor, {
        x: details.x,
        y: details.y,
        duration: 0.4,
        ease: "back.out"
    })
})

function getTopScore() {
    var stored = localStorage.getItem('topScore');
    return stored ? Number(stored) : 0;
}

function setTopScore(value) {
    localStorage.setItem('topScore', String(value));
}
function makeBubble(){
    var clutter = "";

    for (let i = 1; i <= 140; i++) 
    {
        var rn = Math.ceil(Math.random() * 10);
        clutter += `<div class="bubble">${rn}</div>`;
    }
    
    var pbtm = document.querySelector("#pbtm");
    pbtm.innerHTML = clutter;
}

async function runTimer(){
    var t = setInterval(() => {
        if (timer > 0) {
            timer--;
            document.querySelector("#timerVl").textContent = timer;
        }
    
        else{
    clearInterval(t);

    var previousTop = getTopScore();
    var isNewHigh = score > previousTop;
    if (isNewHigh) setTopScore(score);

    var message = isNewHigh ? '🎉 New High Score!' : 'Keep trying!';
    var topDisplay = isNewHigh ? score : previousTop;

    document.querySelector("#pbtm").innerHTML = `
        <div style="text-align:center;">
            <h1>GAME OVER!</h1>
            <p style="margin:8px 0;">Your score: <strong>${score}</strong></p>
            <p style="margin:8px 0;">Top score: <strong>${topDisplay}</strong></p>
            <p style="margin:8px 0;">${message}</p>
            <button id="restartBtn" class="box" style="margin-top:12px; cursor:pointer;">Restart</button>
        </div>
    `;

    document.querySelector("#hitVal").textContent = '';

    // Make sure the Score block is visible again (in case it was hidden)
    var scoreElem = document.querySelector("#scoreVal") && document.querySelector("#scoreVal").closest(".elem");
    if (scoreElem) scoreElem.classList.remove("hidden");

    // Restart button to play again
    var restartBtn = document.querySelector("#restartBtn");
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            score = 0;
            timer = 60;
            document.querySelector("#scoreVal").textContent = '0';
            document.querySelector("#timerVl").textContent = '60';
            makeBubble();
            newHit();
            runTimer();
        });
    }
}
        
    }, 1000);
}

function newHit(){
    hitrn = Math.ceil(Math.random() * 10);
    var hit = document.querySelector("#hitVal");
    hit.textContent = hitrn;
}

function increaseScore(){
    score += 10;
    var sc = document.querySelector("#scoreVal");
    sc.textContent = score; 
}

function decreaseScore(){
    score -= 5;

    if (score < 0) {
        score = 0;
    }

    document.querySelector("#scoreVal").textContent = score;
}


makeBubble();
newHit();

tl.from("#panel", {
    duration: 1,
    x: 200,
    opacity: 0,
    ease: "power2.inOut",
})

tl.from("#ptop", {
    duration: 1,
    x: -500,
    opacity: 0,
    ease: "power2.inOut",
})

tl.from(".bubble", {
    duration: 1,
    y: 200,
    opacity: 0,
    ease: "power2.inOut",
    stagger: 0.02
})

tl.from(".elem, .box", {
    duration: 0.5,
    y: -50,
    opacity: 0,
    delay: 0.5
})

tl.eventCallback("onComplete", function() {
    runTimer();
});

document.querySelector("#pbtm").addEventListener('click', function(details)
{
    if (timer > 0)
    {
        var clickedNum = Number(details.target.textContent);

        if (clickedNum === hitrn) 
        {
            increaseScore();
        } 

        else 
        {
            decreaseScore();
        }

        newHit();
        makeBubble();
    }
});
