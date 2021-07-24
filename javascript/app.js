const DAY_SECONDS = 86400;

//amount of mistakes commited in this stage
//stage mistakes are counted for evolution purposes
//the death score is decrased gradually over time, but if it goes above a certain limit, the vpet dies
let stage_care_miss_count = 0;
let care_miss_death_score = 0;


//timers for care mistakes, when set  to true countdown for that specific mistake begins
//if the timer hits zero, one mistake is added
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

//used to display age
let age_in_seconds = 0;

//movement variables for walking
let is_going_at_left = true;
let limit_left = 0;
let limit_right = 520;

//icon in the game menu currently selected, goes from 0 to 6, representing each option available
//(7 is an alert icon, it's not selectable)
let current_selected_icon = 0;

//which window of the stats mernu are you in right now
let selected_stats_menu = 0;

//pet need meter, food and fun goes from 0 to 4, discipline from 0 to 1
let food_stat = 1;
let fun_stat = 1;
let discipline_stat = 0;
let satiety = 0;

//used for clearing the game animations
let clear_animation_counter = 0;

//inside menu option contollers, meal/snack off/on
let selected_food = 0;
let selected_sleep_menu = 0;

//random number (0-1) determines whether the pet will obey when you tell it to eat meals or play games
//when timer hits zero the number is re-rolled
let obedience_roll = 0.5;
let obedience_reroll_timer = 60;

//base weight
//add gained weight as separate variable
let base_weight  = 30; 
let extra_weight = 0;

//poops when time hits zero, timer is then set to a random number
//poop count and uncleaned time are accounted for sickness calculations
//5400 base value
//randomize between 0 and 3600 to add to base
let poop_timer = 3600;
let poop_count = 0;
let poop_uncleaned_time = 0;

//From time to time, check for sickness, poop count and diet may cause sickness, but it also might be random
//random_sickness_limit is the limit for a 0-1 random number, going below it will make the pet sick
//different species have different values for this limit.
//if death_timer hits zero it means the pet got untreated for too long, it will cause death.
//missed sick call assures the player will only get 1 care mistake for not medicating the pet imediatelly
let is_sick = false;
//current time to respond: 1h45min after sick
let sickness_death_timer = 6300;
//random sickness limit may be changed for diferent evolutions
let random_sickness_limit = 0.25;
let sick_check_timer = 3600;
let is_missed_sick_call = false;

//eating too much candy will make the pet sick
let candy_sick_counter = 0;

//amount of games won without lost rounds
let perfect_minigame_count = 0;
//accounts if the player ever played a game with the pet
let is_ever_played_minigame = false;

//assures the player will only get 1 care mistake for mising bed time per night.
let is_missed_bedtime = false;
let is_already_slept = false;
let sleep_time = new Date(0,0,0,20,0,0);
let wake_up_time = new Date(0,0,0,8,0,0);

//used to assure only one toolbar item is open at a time
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


let audio_array = Array();
audio_array[0]  = new Audio("./audio/attention_call.wav");
audio_array[1]  = new Audio("./audio/button_beep.wav");
audio_array[2]  = new Audio("./audio/clean_poop.wav");
audio_array[3]  = new Audio("./audio/death.wav");
audio_array[4]  = new Audio("./audio/disobey.wav");
audio_array[5]  = new Audio("./audio/eat.wav");
audio_array[6]  = new Audio("./audio/evolution.wav");
audio_array[7]  = new Audio("./audio/minigame_final_lose.wav");
audio_array[8]  = new Audio("./audio/minigame_final_win.wav");
audio_array[9]  = new Audio("./audio/minigame_round_correct.wav");
audio_array[10] = new Audio("./audio/minigame_round_wrong.wav");
audio_array[11] = new Audio("./audio/scold.wav");
audio_array[12] = new Audio("./audio/vaccine.wav");

//in food menu - 0
//in status menu - 1
//in game menu - 2
//in sleep menu - 3

//toilet, medication and scold generate no status change because they have no menu

//main menu - 8
//animation - 9
let current_action = 8;

//note that light on and sleeping have different meanings
let is_light_on = true;
let is_sleeping = false;
let is_dead = false;
let is_egg = true;

//evolution points accounting for going to the next stage
let evolution_count = 0;
let next_evolution_limit = 300;

//stores the evolution stage your pet is at
let current_pet_stage = 0;
let current_pet_version = "a";

//if true, starts calculationg time for death by aging
let is_evolution_final = false;

//how much each meter is depleted each second
let food_need_per_second = 0.0011;
let fun_need_per_second  = 0.0011;

//controls to block saving if game is shut down during simulation time
//also needed to control the simulation loop
let is_simulating = false;
//manipulated to get the sleep time during simulation
//also necessary to control smart pause
let simulation_date;

//controls game mode
let is_simulate_time_away_mode = false;
let is_smart_pause_mode = false;
let is_smart_pause_slept = false;

//mute options
let is_automute_enabled = true;
let is_muted = false;

//only the first open window gets to save
//the others are prompted to be closed by the user (who might ignore the warning and overlap saves)
//(which is not ok.)
let is_this_window_first_open = true;


//array containing information about each evolution
let evolution_array = Array();

evolution_array["0-a"] = {
    food_need_per_second: 0,
    fun_need_per_second: 0,
    is_evolution_final: false,
    random_sickness_limit: 0,
    base_weight:0,
    sleep_time:  new Date(0,0,0,22,00,0),
    wake_up_time:  new Date(0,0,0,8,0,0),
    next_evolution_limit: 300
};



//KID
evolution_array["1-a"] = {
    food_need_per_second: 0.0011,
    fun_need_per_second: 0.0011,
    is_evolution_final: false,
    random_sickness_limit: 0.40,
    base_weight:30,
    sleep_time:  new Date(0,0,0,20,30,0),
    wake_up_time:  new Date(0,0,0,8,0,0),
    next_evolution_limit: 1 * DAY_SECONDS
};

//TEENS
evolution_array["2-a"] = {
    food_need_per_second: 0.0011,
    fun_need_per_second: 0.0009,
    is_evolution_final: false,
    random_sickness_limit: 0.20,
    base_weight: 40,
    sleep_time:  new Date(0,0,0,21,30,0),
    wake_up_time:  new Date(0,0,0,8,0,0),
    next_evolution_limit: 2 * DAY_SECONDS
};
evolution_array["2-b"] = {
    food_need_per_second: 0.0013,
    fun_need_per_second: 0.0011,
    is_evolution_final: false,
    random_sickness_limit: 0.25,
    base_weight: 50,
    sleep_time:  new Date(0,0,0,21,0,0),
    wake_up_time:  new Date(0,0,0,9,0,0),
    next_evolution_limit: 2 * DAY_SECONDS
};


//ADULTS
evolution_array["3-a"] = {
    food_need_per_second: 0.0009,
    fun_need_per_second: 0.0009,
    is_evolution_final: true,
    random_sickness_limit: 0.15,
    base_weight: 55,
    sleep_time:  new Date(0,0,0,22,0,0),
    wake_up_time:  new Date(0,0,0,8,30,0),
    next_evolution_limit: 19 * DAY_SECONDS
};
evolution_array["3-b"] = {
    food_need_per_second: 0.0011,
    fun_need_per_second: 0.0009,
    is_evolution_final: false,
    random_sickness_limit: 0.20,
    base_weight: 50,
    sleep_time:  new Date(0,0,0,22,30,0),
    wake_up_time:  new Date(0,0,0,9,0,0),
    next_evolution_limit: 9 * DAY_SECONDS
    
};
evolution_array["3-c"] = {
    food_need_per_second: 0.0011,
    fun_need_per_second: 0.0013,
    is_evolution_final: false,
    base_weight: 50,
    random_sickness_limit: 0.25,
    sleep_time:  new Date(0,0,0,23,0,0),
    wake_up_time:  new Date(0,0,0,8,30,0),
    next_evolution_limit: 7 * DAY_SECONDS
};
evolution_array["3-d"] = {
    food_need_per_second: 0.0013,
    fun_need_per_second: 0.0011,
    is_evolution_final: false,
    random_sickness_limit: 0.30,
    base_weight: 40,
    sleep_time:  new Date(0,0,0,22,0,0),
    wake_up_time:  new Date(0,0,0,9,0,0),
    next_evolution_limit: 7 * DAY_SECONDS
};
evolution_array["3-e"] = {
    food_need_per_second: 0.0013,
    fun_need_per_second: 0.0013,
    is_evolution_final: true,
    random_sickness_limit: 0.40,
    base_weight: 65,
    sleep_time:  new Date(0,0,0,21,0,0),
    wake_up_time:  new Date(0,0,0,8,30,0),
    next_evolution_limit: 7 * DAY_SECONDS
};
evolution_array["3-f"] = {
    food_need_per_second: 0.0015,
    fun_need_per_second: 0.0014,
    is_evolution_final: true,
    random_sickness_limit: 0.25,
    base_weight: 75,
    sleep_time:  new Date(0,0,0,21,0,0),
    wake_up_time:  new Date(0,0,0,9,30,0),
    next_evolution_limit: 5 * DAY_SECONDS
};

//SENIOR
evolution_array["4-a"] = {
    food_need_per_second: 0.0009,
    fun_need_per_second:  0.0008,
    is_evolution_final: true,
    random_sickness_limit: 0.15,
    base_weight: 55,
    sleep_time:  new Date(0,0,0,20,30,0),
    wake_up_time:  new Date(0,0,0,9,30,0),
    next_evolution_limit: 5 * DAY_SECONDS
};
evolution_array["4-b"] = {
    food_need_per_second: 0.0012,
    fun_need_per_second:  0.0013,
    is_evolution_final: true,
    random_sickness_limit: 0.20,
    base_weight: 70,
    sleep_time:  new Date(0,0,0,23,30,0),
    wake_up_time:  new Date(0,0,0,10,0,0),
    next_evolution_limit: 5 * DAY_SECONDS
    
};
evolution_array["4-c"] = {
    food_need_per_second: 0.0014,
    fun_need_per_second:  0.0007,
    is_evolution_final: true,
    random_sickness_limit: 0.30,
    base_weight: 55,
    sleep_time:  new Date(0,0,0,20,0,0),
    wake_up_time:  new Date(0,0,0,9,0,0),
    next_evolution_limit: 5 * DAY_SECONDS
};

//plays the audio labeled by the index number
function play_audio(index){
    audio_array[index].play();
}

//tells if the pet should be moving from right to left in the screen
//eggs, dead and sleeping pets shouldn't be walking!
function is_moving(){
    return (!is_sleeping&&!is_dead&&!is_egg);
}

//starts the movement function
function wander(){
    setInterval(() => {
        movePet();
    }, 1000);
}

//puts the pet in the initial position
function initPosition(){
    let pet = document.querySelector(".pet_frame")
    pet.style.left = "260px"
    is_going_at_left = true;
}

//moves the pet frame a bit for each side or turns it around
//also makes the egg flip from side to side continuously
function movePet(){
    let pet_frame = document.querySelector(".pet_frame");
    let pet_sprite = document.querySelector(".pet_sprite");
    let num_values = (pet_frame.style.left).replace("px","");
    num_values = parseInt(num_values);

    if(is_egg){
        if(is_going_at_left){
            pet_sprite.classList.remove("left");
            pet_sprite.classList.add("right");
            is_going_at_left = false;
        }else{
            pet_sprite.classList.remove("right");
            pet_sprite.classList.add("left");
            is_going_at_left = true;
        }
    }

    if(is_moving()){
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

}

//Gets time each second, calling all of the "tick" functions
//which are also called each second
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


//every action that repeats every second is stored here
//some are disabled when the pet is asleep
function game_clock_tick(){

    if(!is_dead){
        if(is_smart_pause_mode)smart_pause_tick();

        aging_tick();
        clear_animation_tick();
        evolution_tick();

        if(!is_egg){
            skip_minigame_stage_tick();
            candy_digestion_tick();
            satiety_tick();
            obedience_tick();
            discipline_tick();
            

            if(!is_sleeping){
                food_tick();
                fun_tick();
                forgive_miss_tick();  
                sick_tick();
                poop_tick();
                fake_tick();
                weight_tick();
            }

            sleep_tick();
            natural_death_tick();
        }
    }

}

//checks if is there a menu animation going on and removes it from screen automatically after a while
function clear_animation_tick(){
    if (current_action == 9){
        if(clear_animation_counter <= 0){
            closeAnimation();
        }else{
            clear_animation_counter--;
        }
    }
}

//calculates extra weight and deducts it from total lifespam
function natural_death_tick(){
    if(is_evolution_final){
        let lifespan_reduction = ( (extra_weight-5) /10) * DAY_SECONDS;
        if(lifespan_reduction < 0)lifespan_reduction = 0;

        let life_line = next_evolution_limit - lifespan_reduction;

        if(evolution_count > life_line){
            die();
        }
    }
}

//records the pet is getting one second older
function aging_tick(){
    age_in_seconds++;
}

//loads species characteristic from species array during evolution
//full version of loading characteristics from species array
//only apply once, during evolution
function import_species_stats(stage,version){
    let species = stage + "-" + version;
    evolve_to = evolution_array[species];
    food_need_per_second = evolve_to.food_need_per_second;
    fun_need_per_second = evolve_to.fun_need_per_second;
    is_evolution_final = evolve_to.is_evolution_final;
    base_weight = evolve_to.base_weight;
    sleep_time = evolve_to.sleep_time;
    wake_up_time = evolve_to.wake_up_time;
    next_evolution_limit = evolve_to.next_evolution_limit;
}

//changes the pet sprite to their current species' sprite
function update_pet_sprite(){
    let pet_sprite = document.querySelector(".pet_sprite");
    pet_sprite.src = "./images/pet_stages/"+ current_pet_stage +"-" + current_pet_version +".png";
}

//loses a fixed amout of discipline keeping the value above zero
//used during evolution
function lose_discipline(discipline_loss){
    discipline_stat -= discipline_loss;
    if(discipline_stat < 0 ) discipline_stat = 0;
}


//check for prerequisites for evolution
//updates if the lifestage is final
//checks if the quest requisites were fulfilled on time
//pets with unfulfilled requisites get a bit more of lifespam and are set to final.
function evolve(){

    //final evolutions don't evolve
    //prevents from reseting the evolution counter
    if(is_evolution_final)return;

    let is_silent = false;

    if(current_pet_stage == 0){
        current_pet_stage = 1;
        current_pet_version = "a";
        is_egg = false;

    }else if(current_pet_stage == 1){
        current_pet_stage = 2;

        if(stage_care_miss_count < 4){
            lose_discipline(0.5);
            current_pet_version = "a";
        }else{
            lose_discipline(0.5);
            current_pet_version = "b";
        }
    }else if(current_pet_stage == 2){
        current_pet_stage = 3;

        if(current_pet_version == "a"){
            if(stage_care_miss_count < 2){
                current_pet_version = "a";                
            }else if(stage_care_miss_count < 4){
                lose_discipline(0.3);
                current_pet_version = "b";  
            }else if(stage_care_miss_count < 6){
                
                current_pet_version = "c";  
            }else if(stage_care_miss_count < 8){
                lose_discipline(0.25);
                current_pet_version = "d";
            }else if(stage_care_miss_count < 10){
                lose_discipline(0.1);
                current_pet_version = "e";  
            }else{
                lose_discipline(0.5);
                current_pet_version = "f";
            }
        }else if(urrent_pet_version == "b"){
            if(stage_care_miss_count < 3){
                lose_discipline(0.25);
                current_pet_version = "d";                
            }else if(stage_care_miss_count < 6){
                lose_discipline(0.1);
                current_pet_version = "e";  
            }else{
                lose_discipline(0.5);
                current_pet_version = "f";  
            }
        }


    }else if(current_pet_stage == 3 && !is_evolution_final){

        if(current_pet_version == "b" && perfect_minigame_count >= 20 && current_pet_stage != 4){
            current_pet_stage = 4;
            current_pet_version = "a";
            return; 
        }else{
            is_silent = true;
            is_evolution_final = true;
            evolution_count += 2 * DAY_SECONDS;
        }

        if(current_pet_version == "c" && !is_ever_been_disciplined && current_pet_stage != 4){
            current_pet_stage = 4;
            current_pet_version = "b";
            return; 
        }else{
            is_silent = true;
            is_evolution_final = true;
            evolution_count += 2 * DAY_SECONDS;
        }

        if(current_pet_version == "d" && !is_ever_played_minigame && current_pet_stage != 4){
            current_pet_stage = 4;
            current_pet_version = "c";
        }else{
            is_silent = true;
            is_evolution_final = true;
            evolution_count += 2 * DAY_SECONDS;
        }       

    }

    
    import_species_stats(current_pet_stage,current_pet_version);

    stage_care_miss_count = 0;
    evolution_count = 0;
    update_pet_sprite();
    if(!is_silent)play_audio(6)
}

//adds to evolution count and then check if it's time to evolve
function evolution_tick(){
    evolution_count++;
    if(evolution_count >= next_evolution_limit)evolve();
}

//satiety will set a limit to how much food the pet will want to eat at a time
function satiety_tick(){
    if(satiety > 0) satiety -= 0.0016;
}

//reset timer for care mistakes, lights up the warning icon and starts the timer for the care mistake
//after 15 minutes, if nothing is done the mistake will be added to the count
function declare_critical(key){

    is_critical[key] = true;
    critical_timer[key] = 900;
    update_critical_icon();

    if(key != "faking")remove_critical("faking");

    play_audio(0);
}

function remove_critical(key){
    is_critical[key] = false;
    critical_timer[key] = 900;
    update_critical_icon();
}

//deduces a bit of the food meter based on the food need variable
//keeps the food meter abobe zero if it hits zero
//call for care mistake when it hits zero.
function food_tick(){
    if(food_stat > 0){
        food_stat -= food_need_per_second;
        if(food_stat < 0)food_stat=0;
    }else if(!is_critical["food"]){
        declare_critical("food");
    }else if(is_critical["food"]){
        critical_tick("food");
    }
}

//loses a bit of extra weight if pet is not sleeping
function weight_tick(){
    //doesn't loses weight while sleeping
    //trend is to lose 0.32 gram each hour after meal
    if(extra_weight > 0){
        extra_weight -= 0.00135;
    }
}

//deduces a bit of the fun meter based on the food need variable
//keeps the food meter abobe zero if it hits zero
//call for care mistake when it hits zero.
function fun_tick(){
    if(fun_stat > 0){
        fun_stat -= fun_need_per_second;
        if(fun_stat < 0)fun_stat=0;
    }else if(!is_critical["fun"]){
        declare_critical("fun");
    }else if(is_critical["fun"]){
        critical_tick("fun");
    }
}

//loses a bit of discipline each second
function discipline_tick(){
    if(discipline_stat > 0)discipline_stat -= 0.000008;
}

//roll new value for obedience
function reroll_obedience(){
    obedience_roll = Math.random();
}

//controll timer for obedience value reroll
function obedience_tick(){
    obedience_reroll_timer--;
    if(obedience_reroll_timer <= 0){

        reroll_obedience();
        obedience_reroll_timer = 60;
    }
}

//check if pet will obey you, considering a base of 60% obedience + up to extra 40% based on discipline
//will always obey if under 1 bar in the stat checking
function obedience_check(stat_to_check){
    let order_value = 0.6 + discipline_stat*0.4;
    if(stat_to_check == "food" && food_stat <= 1)return true;
    if(stat_to_check == "fun"  &&  fun_stat <= 1)return true;

    return (order_value > obedience_roll);
}

//digests 1 candy per hour, accumulating undigested candy will get your pet sick
function candy_digestion_tick(){
    if(candy_sick_counter > 0) candy_sick_counter -= 0.0003;
}

//Timer for the fake discipline calls
//fake calls don't count as mistakes when timer hits zero
//pets will call less the more disciplined they get
function reset_fake_critical_timer(){
    faking_critical_timer = 7200 + Math.floor(Math.random()*3600) - Math.floor( (1 - discipline_stat)*3600);
}


//Don't ticks or calls during real calls
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

//Timer for mistake calls
//upon reaching zero will issue a mistake
//different mistakes are treated differently by the critical_miss function
function critical_tick(key){
    critical_timer[key]--;
    if(critical_timer[key]<= 0) critical_miss(key);
}

//Registers a miss and then acts differently depending on which key is calling
//food and fun timers reset and keep going
//sleep and sick are only registered once, they aren't recurrent
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

//light up or turn off the attention icon, depending on wheter there is an attention call going
function update_critical_icon(){
    let is_icon_active = !is_dead && (is_critical["food"]||is_critical["fun"]||is_critical["sleep"]||is_critical["sick"]||is_critical["faking"]);
    let critical_icon = document.querySelector(".menu_attention");

    if(is_icon_active){
        critical_icon.classList.remove("unselected_icon");
        critical_icon.classList.add("selected_icon");
    }else{
        critical_icon.classList.remove("selected_icon");
        critical_icon.classList.add("unselected_icon");
    }
    
}

//ticks one second from poop timer, and if it's time to poop, calls for poop function
function poop_tick(){
    poop_timer--;
    update_poop_uncleaned_time();

    if(poop_timer <= 0)poop_trigger();
}

//counts how many seconds of cleaning your pet has been missing, used on calculations for sickness
function update_poop_uncleaned_time(){
    if(poop_count > 0){
        poop_uncleaned_time++;
    }else{
        poop_uncleaned_time = 0;
    }
}

//poops, increasing amound of poop on the screen, adding 1 poop for sickness calculation counts and
//reseting poop timer
function poop_trigger(){
    if(poop_count < 3)poop_count++;
    update_poop_display();
    reset_poop_timer();
}

//visually updates amount of poop on the screen
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

//resets the counter for the next time the pet will need to poop (1:30h~2:30h)
function reset_poop_timer(){
    let base_time = 5400;
    let variable_time_max = 3600;

    poop_timer = base_time + Math.floor(Math.random()*variable_time_max);
}

//removes poop from the pet area, reseting the uncleaned poop time and count.
function clean_poop(){
    poop_count = 0;
    update_poop_display();
    displayAnimation(6);
    play_audio(2);
}

//confirms the scold action and gives extra discipline if applied correctly
//will give negative fun stat if applied at the wrong time
function confirmScoldMenu(){
    if(is_critical["faking"]){
        remove_critical("faking");
        discipline_stat += 0.25;
        if(discipline_stat >= 1) discipline_stat = 1;
        is_ever_been_disciplined = true;
    }else{
        fun_stat -= 1;
        if(fun_stat < 0)fun_stat=0;
    }
    displayAnimation(8);
    play_audio(11);
}

//ticks the sickness check timer
//checks if the pet will die for being sick for too long
//counts for care mistake in case of sickness
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
            die();
        }
    }
}


//resets timer for sickness check
//random sickness limit now also influences the variable time limit
function reset_sick_timer(){
    let base_time = 3600;
    let variable_time_max = ( 1 - random_sickness_limit) * 3600 ;

    sick_check_timer = base_time + Math.floor(Math.random()*variable_time_max);
}

//Checks random values and based on status will decide if pets sick or if it doesn't
//gives mistake counts if sickness is caused by a care mistake.
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

    if(candy_sick_counter >= 5){
        candy_sick_counter = 0;
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

//updates logical and visual factors for your pet getting sick.
function get_sick() {
    /*
    let sick_icon = document.querySelector(".sick_icon");
    sick_icon.classList.remove("hidden_display");
    */
    
    is_sick = true;
    sickness_death_timer = 6300;
    is_missed_sick_call = false;

    declare_critical("sick");
    update_sick_icon();
}


//updates logical and visual factors for your pet getting healed.
function get_healed(){
    /*
    let sick_icon = document.querySelector(".sick_icon");
    sick_icon.classList.add("hidden_display");
    */
    
    is_sick = false;
    sickness_death_timer = 6300;

    is_missed_sick_call = false;
    remove_critical("sick");
    update_sick_icon();

    displayAnimation(7);
    play_audio(12);
}

//checks if pet is sick
//resets timer for pet sickness
function sick_trigger(){

    sick_chance_roll();
    //resets even if it gets sick, sickness makes the timer stop
    reset_sick_timer();
}

//16h forgive 4 misses
//(doesn't ticks when sleeping)
function forgive_miss_tick(){
    if(care_miss_death_score>0)care_miss_death_score -= 0.00007;
}

//dies after 8 mistakes in a row
//9 mistakes = both bars empty for 1 hour + any extra mistake.
function check_death_by_miss(){
    if(care_miss_death_score >= 15)die();
}

//if pet is dead, show the death screen
function update_death_display(){
    let death_display = document.querySelector(".death_display");
    if(is_dead){
        death_display.classList.remove("hidden_display");
    }else{
        death_display.classList.add("hidden_display");
    }
}

//removes all critical, change pet's stage to dead
//closes all menus, turns on llght
//brings you back to main menu
function die(){
    is_simulating = false;
    is_light_on = true;
    updateLightDisplay();

    closeAnimation();
    closeFoodMenu();
    closeMinigame();
    closeStatsMenu();

    remove_critical("food");
    remove_critical("fun");
    remove_critical("sleep");
    remove_critical("sick");
    remove_critical("faking");
    update_critical_icon();

    is_dead = true;
    current_action = 8;

    update_death_display();
    play_audio(3);

}

//returns pet to egg stage and resets it's stats
function reset_stats(){
    stage_care_miss_count = 0;
    care_miss_death_score = 0;

    is_critical["food"]  = false;
    is_critical["fun"]   = false;
    is_critical["sleep"] = false;
    is_critical["sick"]  = false;
    is_critical["faking"] = false;



    critical_timer["food"]  = 900;
    critical_timer["fun"]   = 900;
    critical_timer["sleep"] = 900;
    critical_timer["sick"]  = 900;
    critical_timer["faking"]  = 900;

    reset_fake_critical_timer();

    age_in_seconds = 0;

    is_going_at_left = true;

    selected_stats_menu = 0;

    food_stat = 1;
    fun_stat = 1;
    discipline_stat = 0;

    clear_animation_counter = 0;

    selected_food = 0;
    selected_sleep_menu = 0;
    satiety = 0;

    obedience_roll = 0.5;
    obedience_reroll_timer = 60;

    //base weight
    //add gained weight as separate variable
    base_weight  = 30; 
    extra_weight = 0;

    //5400 base value
    //randomize between 0 and 3600 to add to base
    reset_poop_timer();
    poop_count = 0;
    poop_uncleaned_time = 0;

    is_sick = false;
    sickness_death_timer = 6300;
    //random sickness limit may be changed for diferent evolutions
    random_sickness_limit = 0.25;
    sick_check_timer = 3600;
    is_missed_sick_call = false;

    candy_sick_counter = 0;

    perfect_minigame_count = 0;
    is_ever_played_minigame = false;
    is_ever_been_disciplined = false;

    is_missed_bedtime = false;
    is_already_slept = false;

    current_action = 8;

    is_light_on = true;
    is_sleeping = false;
    is_dead = false;
    is_egg = true;
    is_evolution_final = false;


    evolution_count = 0;
    next_evolution_limit = 300;
    current_pet_stage = 0;
    current_pet_version = "a";
}

//return pet stats and game state to zero
function reborn(){
    reset_stats();
    initPosition();

    updateLightDisplay();
    update_death_display();
    update_poop_display();
    update_sleepy_icon();
    update_sick_icon();
    update_pet_sprite();


    current_action = 8;
}

//checks if there is any poop to clean if so makes the clean action
function confirmToiletMenu(){
    if(poop_count>0) clean_poop();
}

//checks if pet is sick before healing it
function confirmMedicMenu() {
    if(is_sick) get_healed();
}

//visual function for the game's clock
function updateTime(k) {
    if (k < 10) {
        return "0" + k;
    }
    else {
        return k;
    }
}

//changes visually and logically the selected icon at the main menu
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

//opens the food menu and sets it to default initial option
function openFoodMenu(){
    let menu = document.querySelector(".food_display");
    selected_food = 0;
    updateFoodArrow();
    menu.style.display = "block";
}

//changes the food selected in the food menu
function changeSelectedFood(){
    selected_food++;
    if(selected_food ==2) selected_food=0;
}

//visually updates the game's arrow
function updateFoodArrow(){
    let arrow = document.querySelector(".food_menu_arrow");
    if(selected_food == 0){
        arrow.style.left = "200px"
    }

    if(selected_food == 1){
        arrow.style.left = "540px"
    }
}

//closes food menu
function closeFoodMenu(){
    let menu = document.querySelector(".food_display");
    menu.style.display = "none";
}

//limits how much food the pet will want to eat at a time
function satiety_check(){
    let satiety_limit = 5;
    return (satiety < satiety_limit);
}

//Confirms eating the selected food
function eat_selected_food(){
    if (selected_food == 0){
        satiety += 1;
        extra_weight += 1;
        food_stat += 1;
        if(food_stat >= 4) food_stat = 4;
        remove_critical("food");
    }

    if(selected_food == 1){
        satiety += 1;
        extra_weight += 2;
        food_stat += 1;
        fun_stat += 1;
        if(food_stat >= 4) food_stat = 4;
        if(fun_stat >= 4) fun_stat = 4;
        remove_critical("food");
        remove_critical("fun");

        candy_sick_counter++;
    }
}

//opens the stats menu and brings the player to the initial stats menu screen
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

//close stats menu
function closeStatsMenu(){
    let menu = document.querySelector(".stats_display");
    menu.style.display = "none";
    selected_stats_menu = 0;
}

//flicks through stats menu screens
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

//updates text info on stats menu
function update_stats_display(){
    let age_display = document.querySelector(".stats_age_display");
    let weight_display = document.querySelector(".stats_weight_display");

    let ingame_years_age = Math.floor(age_in_seconds/86400);

    let total_weight_display = Math.round(base_weight+extra_weight);

    age_display.innerText    = ingame_years_age;
    weight_display.innerText = total_weight_display; 
}

//updates heart bars on stats menu, based on rounding
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

//updates the length of the discipline bar
//discipline only
//max width = 576px
function update_discipline_display(){
    const max_width = 576;
    let bar_display;
    bar_display = document.querySelector(".discipline_bar_fill");
    bar_display.style.width = (discipline_stat * max_width) + "px";
}

//shows the to_select menu
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

//hides the to_unselect menu
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

//check for sickness and obedience before confirming eat action
function confirmFoodMenu(){

    if(satiety_check() && !is_sick ){
        if(selected_food == 0){
            if(obedience_check("food") ){
                displayAnimation(1);
                play_audio(5);
                eat_selected_food();
            }else{
                displayAnimation(5);
                play_audio(4);
            }

        }
        if(selected_food == 1){
            displayAnimation(2);
            play_audio(5);
            eat_selected_food();

        }
    }else{

        displayAnimation(5);
        play_audio(4);
    }

}

//displays on screen one of the preselected images based on anim_index
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


//minigame variables
let minigame_score;//right guesses
let minigame_try;//attempts
let guess_is_secret_greater;//current guess
let revealed_value;//value from the number on the left
let secret_value;//value from the number on the right (after reveal)
let minigame_stage;//inner state of the game (waiting for guess, waiting for skip, gameover)

let autoskip_minigame_stage_count = 3;//will wait 3 seconds before skipping
/*
minigame_stage guide:
0 - reveals new revealed_value // hides secret_value
  - let player change "is_greater" until they confirm
  - Player confirm generates and reveals secret_value, game shows result
1 - wait player's click for reset

2 - Ends the game, get the result and displays animation
*/

//opens and resets the minigame
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

//closes the minigame
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

//decide whether game was "perfect" or not and contabilize it propperly
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

//skip minigame wait stage, goes to guess stage (or end screen)
function skip_minigame_stage_tick(){
    //if the current action is gaming and the game stage is wait
    if(current_action==2 && minigame_stage==1){
        autoskip_minigame_stage_count--;
        if(autoskip_minigame_stage_count <= 0)prepare_minigame_round();
    }
}

//get a random number to put on the left
function randomize_revealed_number(){
    let symbol_display = document.querySelector(".revealed_minigame_number");
    revealed_value = 1 + Math.floor(Math.random() * 9);
    symbol_display.innerHTML = revealed_value
}

//change right value to a question mark
function conceal_guessed_number(){
    let symbol_display = document.querySelector(".guessed_minigame_number");
    symbol_display.innerHTML = "?";
}

//get a random number for the right
function generate_guessed_number(){
    let symbol_display = document.querySelector(".guessed_minigame_number");
    secret_value = 1 + Math.floor(Math.random() * 9);
    symbol_display.innerHTML = secret_value
}

//lock guess and generate number on the right, check if guess is rightt
function confirm_round_game(){
    minigame_try++;
    minigame_stage = 1;

    autoskip_minigame_stage_count = 3;

    generate_guessed_number();

    let is_final_secret_greater = (revealed_value < secret_value);

    let is_round_won = ((is_final_secret_greater == guess_is_secret_greater)||(revealed_value==secret_value))

    if(is_round_won){
        minigame_score++;
        play_audio(9);
    }else{ 
        play_audio(10);
    }
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
        is_ever_played_minigame = true;
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
        play_audio(8);
        
    }else if(minigame_score ==4 || minigame_score ==3 ){
        win_minigame(false);
        closeMinigame();
        displayAnimation(3);
        play_audio(8);
    }else{
        closeMinigame();
        displayAnimation(4);
        play_audio(7);
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
        if(is_sleeping && !is_light_on)declare_critical("sleep");
        is_light_on = true;        
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

   
    return ((day_begin <= current_time_seconds && current_time_seconds<wake_up_time_seconds) || (sleep_time_seconds<current_time_seconds&&current_time_seconds<=day_end))
}

function update_sleepy_icon(){
    let icon = document.querySelector(".sleepy_icon");
    if(is_sleeping){
        icon.classList.remove("hidden_display");
    }else{
        icon.classList.add("hidden_display");
    }
}

function update_sick_icon(){
    let icon = document.querySelector(".sick_icon");
    if(is_sick){
        icon.classList.remove("hidden_display");
    }else{
        icon.classList.add("hidden_display");
    }
}

function sleep(){
    let icon = document.querySelector(".sleepy_icon");
    icon.classList.remove("hidden_display");


    is_sleeping = true;
    is_already_slept = true;

    updateLightDisplay();
}

function wake_up(){
    let icon = document.querySelector(".sleepy_icon");
    icon.classList.add("hidden_display");

    //turn on the light
    if(is_already_slept){
        is_light_on = true;
        updateLightDisplay();
    }

    is_missed_bedtime = false;
    is_sleeping = false;
    is_already_slept = false;

    remove_critical("sleep");
}

function sleep_tick(){
    let date_to_check;
    if(!is_simulating){
        date_to_check = new Date();
    }else{
        date_to_check = simulation_date;
    }


    if(is_sleeptime(date_to_check)){
        if(!is_sleeping){
            if(is_light_on && !is_critical["sleep"])declare_critical("sleep");
            sleep();
        }
        if(is_light_on && !is_missed_bedtime)critical_tick("sleep");
        
    }else{
        if(is_already_slept)wake_up();
    }
}
//options: customize sound savestate
function open_toolbar(menu_option){
    let menu_class_name = "." + menu_option + "_menu";

    if(!is_toolbar_menu_open){
        if(menu_option == "savestate"){
            reset_lock_break_count = 0;
            update_reset_lock_icon();
            update_gamemode_radio_button();
        }

        if(menu_option == "sound"){
            load_audio_config();
        }

        if(menu_option == "customize"){
            preselect_current_skins();
        }

        is_toolbar_menu_open = true;
        let menu = document.querySelector(menu_class_name);
        menu.style.display = "block";
    }
}

function close_toolbar(menu_option){
    let menu_class_name = "." + menu_option + "_menu";

    is_toolbar_menu_open = false;
    let menu = document.querySelector(menu_class_name );
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

function update_volume(action_volume,alert_volume,button_volume){
    for(let i = 0;i < audio_array.length; i++){
        if( i == 0 ){
            audio_array[i].volume = alert_volume*0.2;
        }else if( i == 1){
            audio_array[i].volume = button_volume*0.2;
        }else{
            audio_array[i].volume = action_volume*0.2;
        }
    }
}

function load_audio_config(){
    let action_volume = Number.parseInt(localStorage.getItem("config_action_volume"));
    let alert_volume  = Number.parseInt(localStorage.getItem("config_alert_volume"));
    let button_volume = Number.parseInt(localStorage.getItem("config_button_volume"));

    let is_automute_enabled = localStorage.getItem("config_is_automute_enabled")=="true";


    update_volume(action_volume,alert_volume,button_volume);

    document.querySelector(".action_volume_slider").value = action_volume;
    document.querySelector(".alert_volume_slider").value  = alert_volume;
    document.querySelector(".button_volume_slider").value = button_volume;

    document.querySelector(".automute_volume_checkbox").checked = is_automute_enabled;
}

function click_volume_apply_button(){
    let action_volume = document.querySelector(".action_volume_slider").value;
    let alert_volume  = document.querySelector(".alert_volume_slider").value;
    let button_volume = document.querySelector(".button_volume_slider").value;

    let is_automute_enabled = document.querySelector(".automute_volume_checkbox").checked;

    localStorage.setItem("config_action_volume" , action_volume );
    localStorage.setItem("config_alert_volume"  , alert_volume);
    localStorage.setItem("config_button_volume" , button_volume);

    localStorage.setItem("config_is_automute_enabled" , is_automute_enabled);

    update_volume(action_volume,alert_volume,button_volume);
    play_audio(8);
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

function update_gamemode_radio_button(){
    let radio_array = document.querySelectorAll(".gamemode_radio");
    let gamemode = Number.parseInt(localStorage.getItem("config_gamemode"));

    radio_array[gamemode].checked =  true;
}

function select_gamemode_radio(index){
    let radio_array = document.querySelectorAll(".gamemode_radio");
    if(index >=0 && index <=2) radio_array[index].checked =  true;
}

function update_gamemode(){
    let gamemode = Number.parseInt(localStorage.getItem("config_gamemode"));
    

    if (gamemode==0){//pause
        is_simulate_time_away_mode = false;
        is_smart_pause_mode = false;
    }else if(gamemode==1){//smart-pause
        is_simulate_time_away_mode = false;
        is_smart_pause_mode = true;
    }else if(gamemode==2){//continuous
        is_simulate_time_away_mode = true;
        is_smart_pause_mode = false;
    }else{
        
        set_default_gamemode();
    }


}

function click_savestate_apply_button(){
    let radio_array = document.querySelectorAll(".gamemode_radio");
    let gamemode;

    for(let i = 0; i< 3; i++){
        if(radio_array[i].checked)gamemode = radio_array[i].value;
    }

    localStorage.setItem("config_gamemode" , gamemode);
    update_gamemode();
    play_audio(8);
}

function load_local_customization(){
    let screen_color = localStorage.getItem("localsave_screen_color")
    let frame_color  = localStorage.getItem("localsave_frame_color")
    let button_color = localStorage.getItem("localsave_button_color")


    update_customization(screen_color,frame_color,button_color);
}

function save_local_gameState(){
    localStorage.setItem("localsave_stage_care_miss_count" , stage_care_miss_count );
    localStorage.setItem("localsave_care_miss_death_score" , care_miss_death_score );

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
    localStorage.setItem("localsave_satiety", satiety);

    localStorage.setItem("localsave_obedience_roll", obedience_roll);
    localStorage.setItem("localsave_obedience_reroll_timer", obedience_reroll_timer);

    localStorage.setItem("localsave_base_weight", base_weight);
    localStorage.setItem("localsave_extra_weight", extra_weight);

    localStorage.setItem("localsave_poop_timer", poop_timer);
    localStorage.setItem("localsave_poop_count", poop_count);
    localStorage.setItem("localsave_poop_uncleaned_time", poop_uncleaned_time);

    localStorage.setItem("localsave_is_sick", is_sick)
    localStorage.setItem("localsave_sickness_death_timer", sickness_death_timer);
    localStorage.setItem("localsave_sick_check_timer", sick_check_timer);

    localStorage.setItem("localsave_is_missed_bedtime", is_missed_bedtime);
    localStorage.setItem("localsave_is_already_slept", is_already_slept);

    localStorage.setItem("localsave_candy_sick_counter", candy_sick_counter);
    localStorage.setItem("localsave_perfect_minigame_count", perfect_minigame_count );
    localStorage.setItem("localsave_is_ever_played_minigame", is_ever_played_minigame );
    localStorage.setItem("localsave_is_ever_been_disciplined", is_ever_been_disciplined );

    localStorage.setItem("localsave_is_light_on", is_light_on );
    localStorage.setItem("localsave_is_sleeping", is_sleeping );
    localStorage.setItem("localsave_is_dead", is_dead );
    localStorage.setItem("localsave_is_egg", is_egg );

    localStorage.setItem("localsave_evolution_count", evolution_count );
    localStorage.setItem("localsave_next_evolution_limit", next_evolution_limit );
    localStorage.setItem("localsave_current_pet_stage", current_pet_stage );
    localStorage.setItem("localsave_current_pet_version", current_pet_version );

}


//Light load species for game load
function reload_species_characteristics(current_pet_stage,current_pet_version){
    let species = current_pet_stage + "-" + current_pet_version;
    evolve_to = evolution_array[species];

    food_need_per_second = evolve_to.food_need_per_second;
    fun_need_per_second = evolve_to.fun_need_per_second;
    random_sickness_limit = evolve_to.random_sickness_limit;
    base_weight = evolve_to.base_weight;
    sleep_time = evolve_to.sleep_time;
    wake_up_time = evolve_to.wake_up_time;

    //next_evolution_limit needs to be saved because of secret evolutions lifespan variations
    //is_evolution_final is also dynamic, can't be loaded from here
}


function is_action_menu_available(){
    return (is_light_on && !is_dead && !is_egg)
}

function save_logout_date(){
    let logout_date = new Date();
    let logout_parsed_date = Date.parse(logout_date);

    localStorage.setItem("logout_date", logout_date.toUTCString() );
    localStorage.setItem("logout_parsed_date", logout_parsed_date);
}

function get_time_elapsed_since_logout(){
    let current_date = Date.parse( new Date() );
    let logout_date  =  Number.parseInt(localStorage.getItem("logout_parsed_date"));

    let elapsed_seconds = Math.round((current_date - logout_date)/1000);

    return elapsed_seconds;
}

function simulation_clock_tick(){
    simulation_date.setSeconds( simulation_date.getSeconds() + 1);
}

function smart_pause_tick(){
    if(is_sleeptime)is_smart_pause_slept = true;

    if(!is_sleeptime){
        if(is_smart_pause_slept){
            is_simulating = false;
            is_simulate_time_away_mode = false;
        }else{
            is_simulate_time_away_mode = true;
        }
    }
}

function simulate_time_away(time_away){


    if(time_away < 0 ) time_away = 0;
    if(time_away > 2 * DAY_SECONDS  ) time_away = 2 * DAY_SECONDS;

    is_simulating = true;
    let simulated_seconds = 0;

    simulation_date = new Date(localStorage.getItem("logout_date"));

    while( simulated_seconds <= time_away){

        simulation_clock_tick();
        game_clock_tick();
        simulated_seconds++;

        //autopause
        if(!is_simulating)break;
    }

    is_simulating = false;
}

function set_unload_autosave(){
    window.addEventListener("beforeunload", function () {
        //check if is simulating before saving ()
        if(!is_simulating && is_this_window_first_open){
            save_local_gameState();
            save_logout_date();
        }
    });
}

function load_local_savestate(){

    stage_care_miss_count = localStorage.getItem("localsave_stage_care_miss_count")
    care_miss_death_score = localStorage.getItem("localsave_care_miss_death_score")

    is_critical["food"] = localStorage.getItem("localsave_is_critical_food") === "true";
    is_critical["fun"] = localStorage.getItem("localsave_is_critical_fun") === "true";
    is_critical["sleep"] = localStorage.getItem("localsave_is_critical_sleep") === "true";
    is_critical["sick"] = localStorage.getItem("localsave_is_critical_sick") === "true";
    is_critical["faking"] =  localStorage.getItem("localsave_is_critical_faking") === "true";

    critical_timer["food"] = Number.parseInt(localStorage.getItem("localsave_critical_timer_food"), 10);
    critical_timer["fun"] = Number.parseInt(localStorage.getItem("localsave_critical_timer_fun"), 10);
    critical_timer["sleep"] = Number.parseInt(localStorage.getItem("localsave_critical_timer_sleep"), 10);
    critical_timer["sick"] = Number.parseInt(localStorage.getItem("localsave_critical_timer_sick"), 10);
    critical_timer["faking"] = Number.parseInt(localStorage.getItem("localsave_critical_timer_faking"), 10);

    faking_critical_timer = Number.parseInt(localStorage.getItem("localsave_faking_critical_timer"), 10);
    age_in_seconds = Number.parseInt(localStorage.getItem("localsave_age_in_seconds"), 10);

    food_stat = Number.parseFloat(localStorage.getItem("localsave_food_stat"), 10);
    fun_stat = Number.parseFloat(localStorage.getItem("localsave_fun_stat"), 10);
    discipline_stat = Number.parseFloat(localStorage.getItem("localsave_discipline_stat"), 10);
    satiety = Number.parseFloat(localStorage.getItem("localsave_satiety"), 10);

    obedience_roll = Number.parseFloat(localStorage.getItem("localsave_obedience_roll"), 10);
    obedience_reroll_timer = Number.parseFloat(localStorage.getItem("localsave_obedience_reroll_timer"), 10);

    base_weight = Number.parseFloat(localStorage.getItem("localsave_base_weight"), 10);
    extra_weight = Number.parseFloat(localStorage.getItem("localsave_extra_weight"), 10);

    poop_timer = Number.parseInt(localStorage.getItem("localsave_poop_timer"), 10);
    poop_count = Number.parseInt(localStorage.getItem("localsave_poop_count"), 10);
    poop_uncleaned_time = Number.parseInt(localStorage.getItem("localsave_poop_uncleaned_time"), 10);

    is_sick = localStorage.getItem("localsave_is_sick") === "true";
    sickness_death_timer = Number.parseInt(localStorage.getItem("localsave_sickness_death_timer"), 10);
    sick_check_timer = Number.parseInt(localStorage.getItem("localsave_sick_check_timer"), 10);

    is_missed_bedtime = localStorage.getItem("localsave_is_missed_bedtime") === "true";
    is_already_slept = localStorage.getItem("localsave_is_already_slept") === "true";

    candy_sick_counter = Number.parseFloat(localStorage.getItem("localsave_candy_sick_counter"), 10);
    perfect_minigame_count = Number.parseInt(localStorage.getItem("localsave_perfect_minigame_count"), 10); 
    is_ever_played_minigame = localStorage.getItem("localsave_is_ever_played_game") === "true";
    is_ever_been_disciplined = localStorage.getItem("localsave_is_ever_been_disciplined") === "true";

    is_light_on = localStorage.getItem("localsave_is_light_on") === "true";
    is_sleeping = localStorage.getItem("localsave_is_sleeping") === "true";
    is_dead = localStorage.getItem("localsave_is_dead") === "true";
    is_egg = localStorage.getItem("localsave_is_egg") === "true";

    evolution_count = Number.parseInt(localStorage.getItem("localsave_evolution_count"));
    next_evolution_limit = Number.parseInt(localStorage.getItem("localsave_next_evolution_limit"));
    current_pet_stage = localStorage.getItem("localsave_current_pet_stage");
    current_pet_version = localStorage.getItem("localsave_current_pet_version");

}

function is_first_time_loading(){
    let is_first = localStorage.getItem("localsave_is_savestate_empty") === null;
    localStorage.setItem("localsave_is_savestate_empty", false );
    return is_first;
}

function load_session(){
    
    load_local_savestate();
    updateLightDisplay();
    update_poop_display();
    update_critical_icon();
    update_death_display();
    reload_species_characteristics(current_pet_stage,current_pet_version);
}


function select_by_value(array, searched_value) {
    for(let i = 0; i < array.length; i++){
        if(array[i].value == searched_value)array[i].selected = 'selected';
    }
}

function preselect_current_skins(){
    let screen_color = localStorage.getItem("localsave_screen_color")
    let frame_color  = localStorage.getItem("localsave_frame_color")
    let button_color = localStorage.getItem("localsave_button_color")

    let screenOptionArray = document.querySelector(".select_screen_color").querySelectorAll("option");
    let frameOptionArray = document.querySelector(".select_shell_color").querySelectorAll("option");
    let buttonOptionArray = document.querySelector(".select_button_color").querySelectorAll("option");

    select_by_value(screenOptionArray, screen_color);
    select_by_value(frameOptionArray, frame_color);
    select_by_value(buttonOptionArray, button_color);
}

function pressA(){
    play_audio(1);

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
    play_audio(1);
    let just_selected;
    if(current_action == 8){
        just_selected = true;
        if(current_selected_icon == 0 && is_action_menu_available()){
            current_action = 0;
            openFoodMenu();
        }
        if(current_selected_icon == 1 && !is_egg){
            current_action = 1;
            openStatsMenu();
        }
        if(current_selected_icon == 2 && is_action_menu_available()){
            if(obedience_check("fun") && !is_sick){
                current_action = 2;
                openMinigameMenu();
            }else{
                displayAnimation(5);
                play_audio(4);
            }
        }
        if(current_selected_icon == 3 && is_action_menu_available()){
            confirmToiletMenu();
        }
        if(current_selected_icon == 4 && is_action_menu_available()){
            confirmMedicMenu();
        }
        if(current_selected_icon == 5 && !is_dead && !is_egg){
            current_action = 3;
            openSleepMenu();
        }
        if(current_selected_icon == 6 && is_action_menu_available()){
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
    play_audio(1);

    let just_selected;

    if(current_action == 0){
        current_action = 8;
        closeFoodMenu();
    }
    if(current_action == 1){
        current_action = 8;
        closeStatsMenu();
        just_selected = true;
        setInterval(() => {
            just_selected = false;
    }, 500);
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

    if(current_action == 8 && is_dead){
        if(!just_selected)reborn();
    }


}

function load_auto_mute_config(){
    let loaded_value = localStorage.getItem("config_is_automute_enabled");
    if( loaded_value === null){
        //sets true by default
        localStorage.setItem("config_is_automute_enabled", true);
    }

    is_automute_enabled = localStorage.getItem("config_is_automute_enabled") === "true";
    

}

function toggle_is_muted(){
    //changes is_muted to opposite value
    is_muted = !is_muted;
    let icon = document.querySelector(".toggle_mute_icon");
    for(let i = 0;i < audio_array.length; i++){
        audio_array[i].muted = is_muted;
    }

    if(is_muted){
        icon.src = "./images/icons/muted_icon.png";
    }else{
        icon.src = "./images/icons/unmuted_icon.png";
    }

}

function set_default_audio(){
    let default_action_volume  = 1;
    let default_alert_volume   = 1;
    let default_button_volume  = 1;

    localStorage.setItem("config_action_volume" , default_action_volume);
    localStorage.setItem("config_alert_volume"  , default_alert_volume);
    localStorage.setItem("config_button_volume" , default_button_volume);

    localStorage.setItem("config_is_automute_enabled" , true);

    update_volume(default_action_volume,default_alert_volume,default_button_volume);

    document.querySelector(".action_volume_slider").value = default_action_volume;
    document.querySelector(".alert_volume_slider").value  = default_alert_volume;
    document.querySelector(".button_volume_slider").value = default_button_volume;

    
}

function set_default_skins(){
    screen_color="#d3f6dB";
    frame_color="color.#708090";
    button_color="#d0ff14";

    localStorage.setItem("localsave_screen_color" , screen_color );
    localStorage.setItem("localsave_frame_color"  , frame_color);
    localStorage.setItem("localsave_button_color" , button_color);


    update_customization(screen_color,frame_color,button_color);
}

function set_default_gamemode(){
    localStorage.setItem("config_gamemode" , 0);
    update_gamemode();
}


let reset_lock_break_count = 0;
function update_reset_lock_icon(){
    let lock_icon = document.querySelector(".reset_lock_icon");
    if(reset_lock_break_count >= 0 && reset_lock_break_count <= 10){
        lock_icon.src = "./images/icons/reset_lock/reset_lock_"+reset_lock_break_count+".png";
        lock_icon.style.display = "block";
    }
}


function click_reset_lock(){

    let lock_icon = document.querySelector(".reset_lock_icon");
    reset_lock_break_count++;

    if(reset_lock_break_count>10){
        lock_icon.style.display = "none";
    }else{
        update_reset_lock_icon();
    }
    
}

function click_reset_button(){
    if(reset_lock_break_count > 10){
        reborn();
        close_toolbar("savestate");
    }
}

function first_load(){
    set_default_skins();
    set_default_audio();
    set_default_gamemode();
    reborn();
}


// registerOpenTab FUNCTION
function registerOpenTab () {
    let tabsOpen = 1;
    while (localStorage.getItem('openTab' + tabsOpen) !== null) {
        tabsOpen++;
    }
    localStorage.setItem('openTab' + tabsOpen, 'open');
    if (localStorage.getItem('openTab2') !== null) {
        is_this_window_first_open = false;
        let retVal = confirm("It seems like there are multiple tabs running Tamajoji.\nPress OK to close this tab or cancel to ignore this message");
        if( retVal == true ) {
            close();
        } else {
            //ignores error message and reactivates the save function
           let close_count = tabsOpen;
           while(close_count > 1){
            localStorage.removeItem('openTab' + (close_count));
            close_count--;
           }
           is_this_window_first_open = true;
        }
        
    }
}
  
// unregisterOpenTab FUNCTION
function unregisterOpenTab(){
    let tabsOpen = 1;
    while (localStorage.getItem('openTab' + tabsOpen) !== null) {
        tabsOpen++;
    }
    localStorage.removeItem('openTab' + (tabsOpen - 1));
}
  
function set_window_singleton(){
    window.addEventListener('load', registerOpenTab);
    window.addEventListener('beforeunload', unregisterOpenTab);
}

function start(){
    set_window_singleton();
    
    load_auto_mute_config();
    if(is_automute_enabled)toggle_is_muted();

    update_gamemode();//loads gamemode from localstate and applies to local variables
    update_gamemode_radio_button();

    currentTime();
    initPosition();
    wander();
    

    set_unload_autosave();
    if(is_first_time_loading()){
        first_load();
    }else{
        load_session();
        if(is_simulate_time_away_mode){
            simulate_time_away( get_time_elapsed_since_logout() );
        }
    }
    load_local_customization();
    load_audio_config();
    preselect_current_skins();
    update_pet_sprite();
    update_sleepy_icon();
    update_sick_icon();
    
 
}

start();