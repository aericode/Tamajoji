let stage_care_miss_count = 0;
let care_miss_death_score = 0;

let is_critical = Array();

is_critical["food"]  = false;
is_critical["fun"]   = false;
is_critical["sleep"] = false;
is_critical["sick"]  = false;

is_critical["faking"] = false;

let critical_timer = Array();

critical_timer["food"]  = 900;
critical_timer["fun"]   = 900;
critical_timer["sleep"] = 900;
critical_timer["sick"]  = 900;

critical_timer["faking"]  = 900;

let is_critical_cooldown = Array();

is_critical_cooldown["food"]  = false;
is_critical_cooldown["fun"]   = false;
is_critical_cooldown["sleep"] = false;
is_critical_cooldown["sick"]  = false;

let critical_cooldown_timer = Array();

critical_cooldown_timer["food"]  = 900;
critical_cooldown_timer["fun"]   = 900;
critical_cooldown_timer["sleep"] = 900;
critical_cooldown_timer["sick"]  = 900;


let faking_critical_timer = 7200;

let age_in_seconds = 0;

let is_going_at_left = true;
let limit_left = 0;
let limit_right = 520;

let current_selected_icon = 0;

let selected_stats_menu = 0;

let food_stat = 0.4;
let fun_stat = 0;
let discipline_stat = 0.1;

let clear_animation_counter = 0;

let selected_food = 0;


let weight = 30;

//5400 base value
//randomize between 0 and 3600 to add to base
let poop_timer = 10000;
let poop_count = 0;
let poop_uncleaned_time = 0;

let is_sick = false;
let sickness_death_timer = 18000;
let sick_check_timer = 10;

let menu = Array();
menu[0] = "menu_food"
menu[1] = "menu_stats"
menu[2] = "menu_play"
menu[3] = "menu_toilet"
menu[4] = "menu_med"
menu[5] = "menu_sleep"
menu[6] = "menu_scold"
menu[7] = "menu_attention"

//in food menu - 0
//in status menu - 1
//in game menu - 2
//in sleep menu - 3

//toilet, medication and scold generate no status change because they have no menu

//main menu - 8
//animation - 9
//death - 10
let current_action = 8;

let is_light_on = true;


let is_moving = true;
function wander(){
    if(is_moving){
        setInterval(() => {
            movePet();
        }, 1000);
    }
}

function initPosition(){
    let pet = document.querySelector(".pet_frame")
    pet.style.left = "260px"
    is_going_at_left = true;
}

function movePet(){
    let pet_frame = document.querySelector(".pet_frame");
    let pet_sprite = document.querySelector(".pet_sprite");
    let num_values = (pet_frame.style.left).replace("px","");
    num_values = parseInt(num_values);

    
    if(is_going_at_left){
        
        
        if(num_values > limit_left){
            num_values -= 10;
            pet_frame.style.left = num_values + "px";
        }else{
            is_going_at_left = false;
            pet_sprite.classList.remove("left");
            pet_sprite.classList.add("right");

            num_values += 10;
            pet_frame.style.left = num_values + "px";
        }

    }else{
        
        if(num_values < limit_right){
            num_values += 10;
            pet_frame.style.left = num_values + "px";
        }else{
            is_going_at_left = true;
            pet_sprite.classList.remove("right");
            pet_sprite.classList.add("left");

            num_values -= 10;
            pet_frame.style.left = num_values + "px";
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

    game_clock_tick();

    let t = setTimeout(function(){ currentTime() }, 1000); /* setting timer */
}

function game_clock_tick(){
    poop_tick();
    aging_tick();
    clear_animation_tick();
    sick_tick();
}

function clear_animation_tick(){
    if (current_action == 9){
        if(clear_animation_counter <= 0){
            closeAnimation();
        }else{
            clear_animation_counter--;
        }
    }
}

function aging_tick(){
    age_in_seconds++;
}

function food_tick(){
    if(food_stat > 0){
        food_stat -= 0.0015;
        if(food_stat < 0)food_stat=0;
    }else if(!is_critical["food"] && !is_critical_cooldown["food"]){
        declare_critical("food");
    }else if(is_critical["food"] && is_critical_cooldown["food"]){
        critical_cooldown_tick("food");
    }else if(is_critical["food"] && !is_critical_cooldown["food"]){
        critical_tick("food");
    }
}

function declare_critical(key){
    is_critical[key] = true;
    critical_timer[key] = 900;
}

function critical_cooldown_tick(key){
    critical_cooldown_timer[key]--;
    if(critical_cooldown_timer <= 0){
        is_critical_cooldown[key] = false;
    }
}

function critical_tick(key){
    critical_timer[key]--;
    if(critical_timer[key]<= 0) critical_miss(key);
}

//Todo:verify death on each critical miss
function critical_miss(key){
    stage_care_miss_count++;
    care_miss_death_score++;

    is_critical_cooldown[key]    = true;
    //current cooldown 15 minutes
    critical_cooldown_timer[key] = 900;

}

function poop_tick(){
    poop_timer--;

    if(poop_timer <= 0)poop_trigger();
}

function update_poop_uncleaned_time(){
    if(poop_count > 0){
        poop_uncleaned_time++;
    }else{
        poop_uncleaned_time = 0;
    }
}

function poop_trigger(){
    if(poop_count < 3)poop_count++;
    update_poop_display();
    reset_poop_timer();
}

function update_poop_display(){
    let max_poop = 3;
    let poop_icon;

    for(let i = 1; i < max_poop+1 ; i++){
        poop_icon = document.querySelector( ".poop_" + i);

        if(i<=poop_count){
            poop_icon.style.display = "inline";
        }else{
            poop_icon.style.display = "none";
        }
    
    }
}

function reset_poop_timer(){
    let base_time = 5400;
    let variable_time_max = 3600;

    poop_timer = base_time + Math.floor(Math.random()*variable_time_max);
}

function clean_poop(){
    poop_count = 0;
    update_poop_display();
    displayAnimation(6);
}

function sick_tick(){
    //doesn't make rolls if sick
    if(!is_sick){
        sick_check_timer--;
        if( sick_check_timer <= 0) sick_trigger();
    }

    if(is_sick){
        sickness_death_timer--;
        if(sickness_death_timer <= 0){
            die();
        }
    }
}

function reset_sick_timer(){
    let base_time = 7200;
    let variable_time_max = 1800;

    sick_check_timer = base_time + Math.floor(Math.random()*variable_time_max);
}

function sick_chance_roll(){
    //POOP RELATED
    if(poop_count > 0){

        const poop_count_debuff      = 0.15 * poop_count;
        const uncleaned_time_debuff  = 0.10 * (poop_uncleaned_time/3600);
        const total_poop_sickness_limit = poop_count_debuff + uncleaned_time_debuff;
        const poop_sickness_rng   = Math.random();

        if(total_poop_sickness_limit > poop_sickness_rng){
            get_sick();
            return;
        }
    }
    //RANDOM CHANCE;
    const random_sickness_limit = 0.15;
    const random_sickness_rng   = Math.random();

    if(random_sickness_limit > random_sickness_rng){
        get_sick();
        return;
    }

    //TODO: candy digestion check

}

function get_sick() {
    let sick_icon = document.querySelector(".sick_icon");
    sick_icon.classList.remove("hidden_display");
    is_sick = true;
    sickness_death_timer = 18000;

}



function get_healed(){
    let sick_icon = document.querySelector(".sick_icon");
    sick_icon.classList.add("hidden_display");
    is_sick = false;
    sickness_death_timer = 18000;

    displayAnimation(7);
}

function sick_trigger(){
    
    sick_chance_roll();
    //resets even if it gets sick, sickness makes the timer stop
    reset_sick_timer();
}

function die(){
    closeAnimation();
    closeFoodMenu();
    closeMinigame();
    closeStatsMenu();
    let death_display = document.querySelector(".death_display");
    death_display.classList.remove("hidden_display");

    current_action = 10;

    //todo: reborn display
}

function confirmToiletMenu(){
    if(poop_count>0) clean_poop();
}

function confirmMedicMenu() {
    if(is_sick) get_healed();
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
    let unselect = document.querySelector( "."+menu[current_selected_icon] );
    unselect.classList.remove("selected_icon");
    unselect.classList.add("unselected_icon");

    current_selected_icon++;
    if(current_selected_icon==7) current_selected_icon = 0;

    let select = document.querySelector( "."+menu[current_selected_icon] );
    select.classList.remove("unselected_icon");
    select.classList.add("selected_icon");

}

function openFoodMenu(){
    let menu = document.querySelector(".food_display");
    selected_food = 0;
    updateFoodArrow();
    menu.style.display = "block";
}

function changeSelectedFood(){
    selected_food++;
    if(selected_food ==2) selected_food=0;
}

function updateFoodArrow(){
    let arrow = document.querySelector(".food_menu_arrow");
    if(selected_food == 0){
        arrow.style.left = "200px"
    }

    if(selected_food == 1){
        arrow.style.left = "540px"
    }
}

function closeFoodMenu(){
    let menu = document.querySelector(".food_display");
    menu.style.display = "none";

    selectMenu(0)
    unselectMenu(1);
    unselectMenu(2);
    unselectMenu(3);
}

function openStatsMenu(){
    let menu = document.querySelector(".stats_display");
    menu.style.display = "block";
    selected_stats_menu = 0;

    update_stats_display();

    selectMenu(0)
    unselectMenu(1);
    unselectMenu(2);
    unselectMenu(3);
}

function closeStatsMenu(){
    let menu = document.querySelector(".stats_display");
    menu.style.display = "none";
    selected_stats_menu = 0;
}

function changeStatsMenu(){


    let prev_selected = selected_stats_menu;
    selected_stats_menu++;
    if(selected_stats_menu == 4) selected_stats_menu = 0;

    if(selected_stats_menu == 0) update_stats_display();
    if(selected_stats_menu == 1) update_heart_display("hunger");
    if(selected_stats_menu == 2) update_heart_display("happy");
    if(selected_stats_menu == 3) update_discipline_display();

    unselectMenu(prev_selected);
    selectMenu(selected_stats_menu);

}

function update_stats_display(){
    let age_display = document.querySelector(".stats_age_display");
    let weight_display = document.querySelector(".stats_weight_display");

    let ingame_years_age = Math.floor(age_in_seconds/86400);


    age_display.innerText    = ingame_years_age;
    weight_display.innerText = weight; 
}

//Arguments: "hunger" or "happy"
function update_heart_display(display){
    let displayed_hearts
    if(display == "hunger"){
        displayed_hearts = Math.round(food_stat);
    }else if(display == "happy"){
        displayed_hearts = Math.round(fun_stat);
    }
    
    let target_heart;
    let max_hearts = 4;

    for(let i=1; i < max_hearts+1; i++){
        target_heart = document.querySelector("." + display + "_heart_" + i);
        if(i <= displayed_hearts){
            target_heart.classList.remove("heart_empty");
            target_heart.classList.add("heart_full");
        }else{
            target_heart.classList.remove("haert_full");
            target_heart.classList.add("heart_empty");
        }
    }
}

//discipline only
//max width = 576px
function update_discipline_display(){
    const max_width = 576;
    let bar_display;
    bar_display = document.querySelector(".discipline_bar_fill");
    bar_display.style.width = (discipline_stat * max_width) + "px";
}

function selectMenu(to_select){
    let menu_list = Array();
    menu_list[0] = "stats_inner_front"
    menu_list[1] = "stats_inner_hunger"
    menu_list[2] = "stats_inner_happiness"
    menu_list[3] = "stats_inner_discipline"

    let select = document.querySelector( "."+menu_list[to_select] );
    select.classList.remove("unselected_stats_menu");
    select.classList.add("selected_stats_menu");
}

function unselectMenu(to_unselect){
    let menu_list = Array();
    menu_list[0] = "stats_inner_front"
    menu_list[1] = "stats_inner_hunger"
    menu_list[2] = "stats_inner_happiness"
    menu_list[3] = "stats_inner_discipline"

    let unselect = document.querySelector( "."+menu_list[to_unselect] );
    unselect.classList.remove("selected_stats_menu");
    unselect.classList.add("unselected_stats_menu");

}

function confirmFoodMenu(){

    if(selected_food == 0){
        displayAnimation(1);

    }
    if(selected_food == 1){
        displayAnimation(2);

    }

}

function displayAnimation(anim_index){
    let anim_array = Array();
    anim_array[0] = "blank_screen";
    anim_array[1] = "eat_meal";
    anim_array[2] = "eat_snack";
    anim_array[3] = "success";
    anim_array[4] = "fail";
    anim_array[5] = "refuse";
    anim_array[6] = "thrash";
    anim_array[7] = "vaccine";

    current_action = 9;

    clear_animation_counter = 3;

    let menu = document.querySelector(".animation_display");
    let image = menu.querySelector("img");
    menu.style.display = "block";
    image.src = "./images/animations/"+ anim_array[anim_index] + ".png";    

}

function closeAnimation(){
    let menu = document.querySelector(".animation_display");
    menu.style.display = "none";
    current_action = 8;
}


let minigame_score;
let minigame_try;
let guess_is_secret_greater;
let revealed_value;
let secret_value;
let minigame_stage;
/*
minigame_stage guide:
0 - reveals new revealed_value // hides secret_value
  - let player change "is_greater" until they confirm
  - Player confirm generates and reveals secret_value, game shows result
1 - wait player's click for reset

2 - Ends the game, get the result and displays animation
*/
function openMinigameMenu(){
    let menu = document.querySelector(".minigame_display");
    menu.style.display = "block";

    minigame_score = 0;
    minigame_try = 0;

    guess_is_secret_greater = false;
    let symbol_display = document.querySelector(".minigame_menu_symbol");
    symbol_display.src = "./images/objects/lesser_equal.png";


    let target_icon;
    for(let i = 1; i < 6; i++){
        target_icon = document.querySelector(".minigame_score_icon_" + i);
        target_icon.src = "./images/objects/mini_game_score_blank.png"
    }

    randomize_revealed_number();
    conceal_guessed_number();
    minigame_stage = 0;
}

function closeMinigame(){
    let menu = document.querySelector(".minigame_display");
    menu.style.display = "none";
}

//switches minigame display and variable
function switchMinigameGuess(){

    guess_is_secret_greater = !guess_is_secret_greater;

    let symbol_display = document.querySelector(".minigame_menu_symbol");

    if(guess_is_secret_greater){
        symbol_display.src = "./images/objects/greater_equal.png";  
    }else{
        symbol_display.src = "./images/objects/lesser_equal.png"; 
    }
}

function win_minigame (is_perfect){
    if(is_perfect){
        fun_stat += 2;
    }else{
        fun_stat += 1;
    }

    if(fun_stat > 4) fun_stat = 4;
}

function randomize_revealed_number(){
    let symbol_display = document.querySelector(".revealed_minigame_number");
    revealed_value = 1 + Math.floor(Math.random() * 9);
    symbol_display.innerHTML = revealed_value
}


function conceal_guessed_number(){
    let symbol_display = document.querySelector(".guessed_minigame_number");
    symbol_display.innerHTML = "x";
}

function generate_guessed_number(){
    let symbol_display = document.querySelector(".guessed_minigame_number");
    secret_value = 1 + Math.floor(Math.random() * 9);
    symbol_display.innerHTML = secret_value
}

function confirm_round_game(){
    minigame_try++;
    minigame_stage = 1;
    generate_guessed_number();

    let is_final_secret_greater = (revealed_value < secret_value);

    let is_round_won = ((is_final_secret_greater == guess_is_secret_greater)||(revealed_value==secret_value))

    if(is_round_won) minigame_score++;    
    update_minigame_display(is_round_won);

}

function update_minigame_display(is_round_won){

    let target_icon = document.querySelector(".minigame_score_icon_" + minigame_try);
    let symbol_display = document.querySelector(".minigame_menu_symbol");

    if(is_round_won){
        target_icon.src    = "./images/objects/mini_game_score_correct.png";
        symbol_display.src = "./images/objects/mini_game_correct.png"; 
    }else{
        target_icon.src    = "./images/objects/mini_game_score_wrong.png";
        symbol_display.src = "./images/objects/mini_game_wrong.png"; 
    }
}

function prepare_minigame_round(){

    if(minigame_try == 5){
        complete_minigame();
        return;
    }


    randomize_revealed_number();
    conceal_guessed_number();

    guess_is_secret_greater = false;
    let symbol_display = document.querySelector(".minigame_menu_symbol");
    symbol_display.src = "./images/objects/lesser_equal.png";

    minigame_stage = 0;
}

function complete_minigame(){
    
    if(minigame_score == 5){
        win_minigame(true);
        closeMinigame();
        displayAnimation(3);
        
    }else if(minigame_score ==4 || minigame_score ==3 ){
        win_minigame(false);
        closeMinigame();
        displayAnimation(3);
    }else{
        closeMinigame();
        displayAnimation(4);
    }

    current_stage = 9;

    
}


function pressA(){
    if(current_action == 8){
        switchMainMenu();
    }

    //food
    if(current_action ==0){
        changeSelectedFood();
        updateFoodArrow();
    }

    //check status
    if(current_action ==1){
        changeStatsMenu();
    }

    if(current_action == 2){
        if(minigame_stage == 0){
            switchMinigameGuess();
        }
        if(minigame_stage == 1){
            prepare_minigame_round();
        }
    }

}

function pressB(){
    if(current_action == 8){
        just_selected = true;
        if(current_selected_icon == 0){
            current_action = 0;
            openFoodMenu();
        }
        if(current_selected_icon == 1){
            current_action = 1;
            openStatsMenu();
        }
        if(current_selected_icon == 2){
            current_action = 2;
            openMinigameMenu();
        }
        if(current_selected_icon == 3){
            confirmToiletMenu();
        }
        if(current_selected_icon == 4){
            confirmMedicMenu();
        }

        setInterval(() => {
            just_selected = false;
        }, 500);
    }

    
    if(current_action == 0 && !just_selected){
        closeFoodMenu();
        confirmFoodMenu();
    }

    if(current_action == 2 && !just_selected){
        if(minigame_stage == 0){
            confirm_round_game();
        }
    }

    

}

function pressC(){
    if(current_action == 0){
        current_action = 8;
        closeFoodMenu();
    }
    if(current_action == 1){
        current_action = 8;
        closeStatsMenu();
    }
    if(current_action == 2){
        current_action = 8;
        closeMinigame();
    }

    if(current_action == 9){
        //current_action = 8;
        closeAnimation();

    }
}

function start(){
    currentTime();
    initPosition();
    wander();
}

start();