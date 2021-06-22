let is_going_at_left = true;
let limit_left = 0;
let limit_right = 520;

let current_selected_menu = 0;

let menu = Array();
menu[0] = "menu_food"
menu[1] = "menu_stats"
menu[2] = "menu_play"
menu[3] = "menu_toilet"
menu[4] = "menu_med"
menu[5] = "menu_sleep"
menu[6] = "menu_scold"
menu[7] = "menu_attention"


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

function switchMainMenu(){
    let unselect = document.querySelector( "."+menu[current_selected_menu] );
    unselect.classList.remove("selected_icon");
    unselect.classList.add("unselected_icon");

    current_selected_menu++;
    if(current_selected_menu==7) current_selected_menu = 0;

    let select = document.querySelector( "."+menu[current_selected_menu] );
    select.classList.remove("unselected_icon");
    select.classList.add("selected_icon");

}

function pressA(){
    console.log("xddddd");
    switchMainMenu();
}

currentTime();
initPosition();
wander();