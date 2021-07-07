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

let faking_critical_timer = 7200;

let age_in_seconds = 0;

let is_going_at_left = true;
let limit_left = 0;
let limit_right = 520;

let current_selected_icon = 0;

let selected_stats_menu = 0;

let food_stat = 1;
let fun_stat = 1;
let discipline_stat = 0;

let clear_animation_counter = 0;

let selected_food = 0;
let selected_sleep_menu = 0;
let satiety = 0;

let obedience_roll = 0.5;
let obedience_reroll_timer = 60;

//base weight
//add gained weight as separate variable
let weight = 30;

//5400 base value
//randomize between 0 and 3600 to add to base
let poop_timer = 3600;
let poop_count = 0;
let poop_uncleaned_time = 0;

let is_sick = false;
let sickness_death_timer = 18000;
//random sickness limit may be changed for diferent evolutions
let random_sickness_limit = 0.15;
let sick_check_timer = 3600;
let is_missed_sick_call = false;

let candy_sick_counter = 0;

let perfect_minigame_count = 0;

let is_missed_bedtime = false;
let sleep_time = new Date(0,0,0,20,0,0);
let wake_up_time = new Date(0,0,0,8,0,0);

let is_toolbar_menu_open = false;

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
let is_sleeping = false;


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
    
    aging_tick();
    clear_animation_tick();
    skip_minigame_stage_tick();
    candy_digestion_tick();
    satiety_tick();

    if(!is_sleeping){
        food_tick();
        fun_tick();    
        forgive_miss_tick();  
        sick_tick();
        poop_tick();
        fake_tick();
    }

    sleep_tick();

    debug();
    update_critical_icon()
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


function satiety_tick(){
    if(satiety > 0) satiety -= 0.0018;
}


function food_tick(){
    if(food_stat > 0){
        food_stat -= 0.0015;
        if(food_stat < 0)food_stat=0;
    }else if(!is_critical["food"]){
        declare_critical("food");
    }else if(is_critical["food"]){
        critical_tick("food");
    }
}

function fun_tick(){
    if(fun_stat > 0){
        fun_stat -= 0.0015;
        if(fun_stat < 0)fun_stat=0;
    }else if(!is_critical["fun"]){
        declare_critical("fun");
    }else if(is_critical["fun"]){
        critical_tick("fun");
    }
}


function discipline_tick(){
    if(discipline_stat > 0)discipline_stat -= 0.000004;
}

function reroll_obedience(){
    obedience_roll = Math.random();
}

function obedience_tick(){
    obedience_reroll_timer--;
    if(obedience_reroll_timer <= 0)reroll_obedience();
}

function obedience_check(stat_to_check){
    const order_value = 0.6 + discipline_stat*0.4;
    if(stat_to_check == "food" && food_stat <= 1)return true;
    if(stat_to_check == "fun"  &&  fun_stat <= 1)return true;

    return (order_value > obedience_roll);
}

function candy_digestion_tick(){
    if(candy_sick_counter > 0) candy_sick_counter -= 0.00003;
}

function reset_fake_critical_timer(){
    faking_critical_timer = 7200 + Math.floor(Math.random()*3600) - Math.floor( (1 - discipline_stat)*3600);
}



function fake_tick(){
    if(!is_critical["food"] || !is_critical["fun"] || !is_critical["sick"] || !is_critical["sleep"] ){
        if(is_critical["faking"]){
            faking_critical_timer--;
            if(faking_critical_timer <= 0)remove_critical("faking");
        }else{
            faking_critical_timer--;
            if(faking_critical_timer <= 0){
                declare_critical("faking");
                reset_fake_critical_timer();
            }
        }
    }
}

function declare_critical(key){

    is_critical[key] = true;
    critical_timer[key] = 900;
    update_critical_icon();

    if(key != "faking")remove_critical("faking");
}

function remove_critical(key){
    is_critical[key] = false;
    critical_timer[key] = 900;
    update_critical_icon();
}


function critical_tick(key){
    critical_timer[key]--;
    if(critical_timer[key]<= 0) critical_miss(key);
}

//Todo:verify death on each critical miss
function critical_miss(key){
    stage_care_miss_count++;
    care_miss_death_score++;


    //food and fun just keep going for criticals after first critical
    if(key=="food" || key=="fun"){
        //reset critical timer
        critical_timer[key] = 900;
    }

    //sleep and sick just remove critical after first miss
    if(key=="sleep" || key == "sick"){
        remove_critical(key);
    }

    //prevents sleep and sick from triggering multiple miss calls in a row
    if(key=="sleep")is_missed_bedtime = true;
    if(key=="sick")is_missed_sick_call = true;
    

    check_death_by_miss();

}

function update_critical_icon(){
    let is_icon_active = (is_critical["food"]||is_critical["fun"]||is_critical["sleep"]||is_critical["sick"]||is_critical["faking"]);
    let critical_icon = document.querySelector(".menu_attention");

    if(is_icon_active){
        critical_icon.classList.remove("unselected_icon");
        critical_icon.classList.add("selected_icon");
    }else{
        critical_icon.classList.remove("selected_icon");
        critical_icon.classList.add("unselected_icon");
    }
    
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

function confirmScoldMenu(){
    if(is_critical["faking"]){
        remove_critical("faking");
        discipline_stat += 0.25;
    }else{
        fun_stat -= 1;
        if(fun_stat < 0)fun_stat=0;
    }
    displayAnimation(8);
}

function sick_tick(){
    //doesn't make rolls if sick

    if(!is_sick){
        sick_check_timer--;
        if( sick_check_timer <= 0) sick_trigger();
    }

    if(is_sick){
        //issues a single critical miss upon not responding to critical call
        if(!is_missed_sick_call)critical_tick("sick");
        sickness_death_timer--;
        if(sickness_death_timer <= 0){
            die(false);
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
            //issue critical miss if uncleaned for a long time
            if(uncleaned_time_debuff > 1800)critical_miss(null);
            get_sick();
            return;
        }
    }
    //TOO MUCH CANDY

    if(candy_sick_counter > 5){
        critical_miss(null);
        get_sick();
        return;
    }

    //RANDOM CHANCE;
    const random_sickness_rng   = Math.random();

    if(random_sickness_limit > random_sickness_rng){
        get_sick();
        return;
    }




}

function get_sick() {
    let sick_icon = document.querySelector(".sick_icon");
    sick_icon.classList.remove("hidden_display");
    is_sick = true;
    sickness_death_timer = 18000;
    is_missed_sick_call = false;

    declare_critical("sick");
}



function get_healed(){
    let sick_icon = document.querySelector(".sick_icon");
    sick_icon.classList.add("hidden_display");
    is_sick = false;
    sickness_death_timer = 18000;

    is_missed_sick_call = false;

    displayAnimation(7);
}

function sick_trigger(){

    sick_chance_roll();
    //resets even if it gets sick, sickness makes the timer stop
    reset_sick_timer();
}

function forgive_miss_tick(){
    if(care_miss_death_score>0)care_miss_death_score -= 0.0003;
}

function check_death_by_miss(){
    if(care_miss_death_score >= 7)die(false);
}

function die(is_death_by_aging){
    is_light_on = true;
    updateLightDisplay();

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
}

function satiety_check(){
    let satiety_limit = 5;
    return (satiety < satiety_limit);
}

function eat_selected_food(){
    if (selected_food == 0){
        satiety += 1;
        weight += 1;
        food_stat += 1;
        if(food_stat >= 4) food_stat = 4;
        remove_critical("food");
    }

    if(selected_food == 1){
        satiety += 1;
        weight += 2;
        food_stat += 1;
        fun_stat += 1;
        if(food_stat >= 4) food_stat = 4;
        if(fun_stat >= 4) fun_stat = 4;
        remove_critical("food");
        remove_critical("fun");

        candy_sick_counter++;
    }
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

    if(satiety_check() && !is_sick ){
        if(selected_food == 0){
            if(obedience_check("food") ){
                displayAnimation(1);
                eat_selected_food();
            }else{
                displayAnimation(5);
            }

        }
        if(selected_food == 1){
            displayAnimation(2);
            eat_selected_food();

        }
    }else{
        displayAnimation(5);
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
    anim_array[8] = "scold";

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

let autoskip_minigame_stage_count = 3;
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
        perfect_minigame_count++;
        fun_stat += 2;
        remove_critical("fun");
    }else{
        fun_stat += 1;
        remove_critical("fun");
    }

    if(fun_stat > 4) fun_stat = 4;
}

function skip_minigame_stage_tick(){
    //if the current action is gaming and the game stage is wait
    if(current_action==2 && minigame_stage==1){
        autoskip_minigame_stage_count--;
        if(autoskip_minigame_stage_count <= 0)prepare_minigame_round();
    }
}

function randomize_revealed_number(){
    let symbol_display = document.querySelector(".revealed_minigame_number");
    revealed_value = 1 + Math.floor(Math.random() * 9);
    symbol_display.innerHTML = revealed_value
}


function conceal_guessed_number(){
    let symbol_display = document.querySelector(".guessed_minigame_number");
    symbol_display.innerHTML = "?";
}

function generate_guessed_number(){
    let symbol_display = document.querySelector(".guessed_minigame_number");
    secret_value = 1 + Math.floor(Math.random() * 9);
    symbol_display.innerHTML = secret_value
}

function confirm_round_game(){
    minigame_try++;
    minigame_stage = 1;

    autoskip_minigame_stage_count = 3;

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


function updateSleepArrow(){
    let arrow = document.querySelector(".sleep_menu_arrow");

    if(selected_sleep_menu == 1){
        arrow.style.top = "150px";
    }

    if(selected_sleep_menu == 0){
        arrow.style.top = "250px";
    }

}

function changeSelectedSleep(){
    selected_sleep_menu++;
    if(selected_sleep_menu ==2) selected_sleep_menu=0;
}

function openSleepMenu(){
    let menu = document.querySelector(".sleep_menu_display");
    selected_sleep_menu = 1;

    updateSleepArrow();
    menu.style.display = "block";
}

function closeSleepMenu(){
    let menu = document.querySelector(".sleep_menu_display");

    menu.style.display = "none";  
}

function confirmSleepMenu(){
    if(selected_sleep_menu==1){
        is_light_on = true;
        if(is_sleeping)declare_critical("sleep");
    }

    if(selected_sleep_menu==0){
        is_light_on = false;
        remove_critical("sleep");
    }

    closeSleepMenu();
    updateLightDisplay();
    current_action = 8;

}

function updateLightDisplay(){

    let menu  = document.querySelector(".sleep_display");
    let clock = document.querySelector(".clock");

    if(is_light_on){
        clock.style.color = "black";
        menu.style.display = "none";
    }

    if(!is_light_on){
        clock.style.color = "white";
        menu.style.display = "block";
    }

    if(is_sleeping){
        menu.querySelector("img").src = "./images/menus/sleeping.png";
    }else{
        menu.querySelector("img").src = "./images/menus/dark.png";
    }
}

function date_to_seconds_elapsed(date){
    let current_hour   = date.getHours();
    let current_minute = date.getMinutes()
    let current_second = date.getSeconds();


    let seconds_val = current_hour*3600 + current_minute * 60 + current_second;
    return seconds_val;
}

function is_sleeptime(current_time){
    const current_time_seconds = date_to_seconds_elapsed(current_time);
    const sleep_time_seconds   = date_to_seconds_elapsed(sleep_time);
    const wake_up_time_seconds = date_to_seconds_elapsed(wake_up_time);
    const day_begin = 0;
    const day_end   = 86400;

    return ((day_begin < current_time_seconds && current_time_seconds<wake_up_time_seconds) || (sleep_time_seconds<current_time_seconds&&current_time_seconds<day_end))
}

function sleep(){
    let icon = document.querySelector(".sleepy_icon");
    icon.classList.remove("hidden_display");


    is_sleeping = true;
    is_moving = false;

    updateLightDisplay();
}

function wake_up(){
    let icon = document.querySelector(".sleepy_icon");
    icon.classList.add("hidden_display");

    is_missed_bedtime = false;
    is_sleeping = false;
    is_moving = true;

    is_light_on = true;
    updateLightDisplay();
}

function sleep_tick(){
    if(is_sleeptime(new Date())){
        if(!is_sleeping){
            if(is_light_on && !is_critical["sleep"])declare_critical("sleep");
            sleep();
        }
        if(is_light_on && !is_missed_bedtime)critical_tick("sleep");
        
    }
}

function open_toolbar_customize(){
    if(!is_toolbar_menu_open){
        is_toolbar_menu_open = true;
        let menu = document.querySelector(".customize_menu");
        menu.style.display = "block";
    }
}

function close_toolbar_customize(){
    is_toolbar_menu_open = false;
    let menu = document.querySelector(".customize_menu");
    menu.style.display = "none";
}

function update_customization(screen_color,frame_color,button_color){

    //DEFAULT SETTINGS
    if(screen_color==null)screen_color="#d3f6dB";
    if(frame_color==null)frame_color="color.#708090";
    if(button_color==null)button_color="#d0ff14";

    let screen_display = document.querySelector(".screen_tint");
    let frame_display  = document.querySelector(".shell_skin");
    let button_array = document.querySelectorAll(".btn");

    screen_display.style.backgroundColor = screen_color;

    let frame_color_array = frame_color.split('.');
    if(frame_color_array[0]=="color"){
        frame_display.style.backgroundColor = frame_color_array[1];
        frame_display.style.backgroundImage = "none";
    }else if(frame_color_array[0]=="skin"){
        frame_display.style.backgroundColor = "none"
        frame_display.style.backgroundImage = "url('./images/shell_skins/"+ frame_color_array[1] +".jpg')"
    }

    for(i=0;i<3;i++){
        button_array[i].style.backgroundColor = button_color;
    }


}

function click_customize_apply_button(){
    let screen_color = document.querySelector(".select_screen_color").value;
    let frame_color  = document.querySelector(".select_shell_color").value;
    let button_color = document.querySelector(".select_button_color").value;

    localStorage.setItem("localsave_screen_color" , screen_color );
    localStorage.setItem("localsave_frame_color"  , frame_color);
    localStorage.setItem("localsave_button_color" , button_color);


    update_customization(screen_color,frame_color,button_color);
}

function load_local_customization(){
    let screen_color = localStorage.getItem("localsave_screen_color")
    let frame_color  = localStorage.getItem("localsave_frame_color")
    let button_color = localStorage.getItem("localsave_button_color")


    update_customization(screen_color,frame_color,button_color);
}

function save_local_gameState(){
    localStorage.setItem("localsave_stage_care_miss_count" , stage_care_miss_count );
    localStorage.setItem("localsave_stage_care_miss_count" , care_miss_death_score );

    localStorage.setItem("localsave_is_critical_food", is_critical["food"]);
    localStorage.setItem("localsave_is_critical_fun", is_critical["fun"]);
    localStorage.setItem("localsave_is_critical_sleep", is_critical["sleep"]);
    localStorage.setItem("localsave_is_critical_sick", is_critical["sick"]);
    localStorage.setItem("localsave_is_critical_faking", is_critical["faking"]);

    localStorage.setItem("localsave_critical_timer_food", critical_timer["food"]);
    localStorage.setItem("localsave_critical_timer_fun", critical_timer["fun"]);
    localStorage.setItem("localsave_critical_timer_sleep", critical_timer["sleep"]);
    localStorage.setItem("localsave_critical_timer_sick", critical_timer["sick"]);
    localStorage.setItem("localsave_critical_timer_faking", critical_timer["faking"]);

    localStorage.setItem("localsave_faking_critical_timer", faking_critical_timer);
    localStorage.setItem("localsave_age_in_seconds", age_in_seconds);

    localStorage.setItem("localsave_food_stat", food_stat);
    localStorage.setItem("localsave_fun_stat", fun_stat);
    localStorage.setItem("localsave_discipline_stat", discipline_stat);

    localStorage.setItem("localsave_obedience_roll", obedience_roll);

    localStorage.setItem("localsave_weight", weight);

    localStorage.setItem("localsave_poop_timer", poop_timer);
    localStorage.setItem("localsave_poop_count", poop_count);
    localStorage.setItem("localsave_poop_uncleaned_time", poop_uncleaned_time);

    localStorage.setItem("localstorage_is_sick", is_sick)
    localStorage.setItem("localstorage_sickness_death_timer", sickness_death_timer);
    localStorage.setItem("localstorage_random_sickness_limit", random_sickness_limit);
    localStorage.setItem("localstorage_sick_check_timer", sick_check_timer);

    localStorage.setItem("localstorage_candy_sick_counter", candy_sick_counter);
    localStorage.setItem("localstorage_perfect_minigame_count", perfect_minigame_count );

    localStorage.setItem("localstorage_is_light_on", is_light_on );
    localStorage.setItem("localstorage_is_sleeping", is_sleeping );
    localStorage.setItem("localstorage_is_sleeping", is_moving );
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

    if(current_action == 3){
        changeSelectedSleep();
        updateSleepArrow();
    }

}

function pressB(){
    if(current_action == 8){
        just_selected = true;
        if(current_selected_icon == 0 && is_light_on){
            current_action = 0;
            openFoodMenu();
        }
        if(current_selected_icon == 1 ){
            current_action = 1;
            openStatsMenu();
        }
        if(current_selected_icon == 2 && is_light_on){
            if(obedience_check("fun")){
                current_action = 2;
                openMinigameMenu();
            }else{
                displayAnimation(5);
            }
        }
        if(current_selected_icon == 3 && is_light_on){
            confirmToiletMenu();
        }
        if(current_selected_icon == 4 && is_light_on){
            confirmMedicMenu();
        }
        if(current_selected_icon == 5){
            current_action = 3;
            openSleepMenu();
        }
        if(current_selected_icon == 6 && is_light_on){
            confirmScoldMenu();
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

    if(current_action == 3 && !just_selected){
        confirmSleepMenu();
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
    if(current_action == 3){
        current_action = 8;
        closeSleepMenu();
    }

    if(current_action == 9){
        closeAnimation();

    }
}

function debug(){
    console.log("is sick? "+ is_sick);
    console.log("sick critical: " + critical_timer["sick"]);
}

function start(){
    currentTime();
    initPosition();
    wander();
    load_local_customization();

}

start();