is_going_at_left = true;
limit_left = 0;
limit_right = 520;


function wander(){
    setInterval(() => {
        movePet();
    }, 1000);
}

function initPosition(){
    let pet = document.querySelector(".pet")
    pet.style.left = "260px"
    is_going_at_left = true;
}

function movePet(){
    let pet = document.querySelector(".pet")
    let num_values = (pet.style.left).replace("px","");
    num_values = parseInt(num_values);
    console.log(num_values);

    
    if(is_going_at_left){
        
        
        if(num_values > 0){
            num_values -= 10;
            pet.style.left = num_values + "px";
        }else{
            is_going_at_left = false;
            pet.classList.remove("left");
            pet.classList.add("right");
        }

    }else{
        
        if(num_values < 520){
            num_values += 10;
            pet.style.left = num_values + "px";
        }else{
            is_going_at_left = true;
            pet.classList.remove("right");
            pet.classList.add("left");
        }
    }

}

function currentTime() {
    let date = new Date(); /* creating object of Date class */
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    hour = updateTime(hour);
    min = updateTime(min);
    sec = updateTime(sec);
    document.querySelector(".clock").innerText = hour + " : " + min ; /* adding time to the div */
    let t = setTimeout(function(){ currentTime() }, 1000); /* setting timer */
}
  
function updateTime(k) {
    if (k < 10) {
        return "0" + k;
    }
    else {
        return k;
    }
}

currentTime();
initPosition();
wander();