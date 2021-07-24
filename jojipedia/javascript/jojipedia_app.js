let max_stat_limit = {
    food: 10,
    fun: 10,
    sick: 6,
    weight: 10,
    sleep: 7,
    wake:7
}

let current_selected_values = {
    name: "",
    text: "",
    time_info: " ",

    food: 0,
    fun: 0,
    sick: 0,
    weight: 0,
    sleep: 0,
    wake:0
}

let pet_stat_array = Array();

pet_stat_array["0-a"] = {
    name:"Egg",
    text:"An Egg. Loves shaking and egging around. Will hatch into a Tamajoji in just a few minutes",
    time_info:"<b>Stage duration</b>: Will hatch soon...",

    food: 0,
    fun: 0,
    sick: 0,
    weight: 0,
    sleep: 0,
    wake:0
}

pet_stat_array["1-a"] = {
    name:"Joji",
    text:`The kid Tamajoji, Jojis are sweet little creatures that need equal parts of food and attention.
        Even when well cared they will always rebel a bit when they evolve into their teenage state,
        giving them lots of discipline helps with that phase.`,
    time_info:"<b>Stage duration</b>: 1 year",

    food: 5,
    fun: 5,
    sick: 5,
    weight: 1,
    sleep: 1,
    wake:1
}

pet_stat_array["2-a"] = {
    name:"Jimini",
    text: `Well cared kid Tamajojis evolve into Jimini. They're a bit more independent, but still
    needs lots of attention, since they can evolve into any of the possible adult stages,
    depending only on how well you care for them.`,
    time_info:"<b>Stage duration</b>: 2 years",

    food: 5,
    fun: 3,
    sick: 5,
    weight: 3,
    sleep: 3,
    wake:1
}

pet_stat_array["2-b"] = {
    name:"Jomomo",
    text:`When not that well cared, kid Tamajojis will evolve into Jomomo. They're even more dependent
    than before, but still won't give you a lot of work. However, their restricted evolution pool mean
    that they really need good care, since evolutions of an uncared Jomomo might give you a LOT of work.`,
    time_info:"<b>Stage duration</b>: 2 years",

    food: 7,
    fun: 5,
    sick: 4,
    weight:5,
    sleep: 2,
    wake:3
}

pet_stat_array["3-a"] = {
    name:"Fiji",
    text:`Although it's might be very hard to get to the adult stage making very little mistakes, Fijis 
    make up for the effort by having a strong health, being very independent and living very long lifes.
    And yes, it's a pajama with a headband. They have a very peculiar fashion style.`,
    time_info:"<b>Average lifespam</b>: 22 years",

    food: 3,
    fun: 3,
    sick: 6,
    weight: 6,
    sleep: 4,
    wake:2
}

pet_stat_array["3-b"] = {
    name:"Jolachi",
    text: `Jolachi is a fun Tamajoji, it's not very needy when it comes to playing, but it loves to see you
    winning without a miss, a natural tryhard. That's a reflection of it's personality, It's very independent
    but it still enjoys hanging around.`,
    time_info:"<b>Average lifespam</b>: 14 years",

    food: 5,
    fun: 3,
    sick: 5,
    weight: 5,
    sleep: 5,
    wake:3
}

pet_stat_array["3-c"] = {
    name:"Jobulin",
    text:`Very active, Jobulins' energy never seems to run out, usually making them to stay up to late.
    They need lots of play, and lots of discipline. To train their body and mind, they're always praticing
    phisical activities (their cloth is a Jojitsu uniform)`,
    time_info:"<b>Average lifespam</b>: 12 years",

    food: 5,
    fun: 7,
    sick: 4,
    weight: 5,
    sleep: 6,
    wake:2
}

pet_stat_array["3-d"] = {
    name:"Achiji",
    text:`Six legs and one horn of pure love and affection. They're healthy, strong and have a considerable
    lifespam, only being a bit needy when it comes to feeding, they really love snacks.`,
    time_info:"<b>Average lifespam</b>: 12 years",

    food: 7,
    fun: 5,
    sick: 3,
    weight: 3,
    sleep: 4,
    wake:2
}

pet_stat_array["3-e"] = {
    name:"JibJob",
    text:`Playful and very hungry, JibJobs are very needy Tamajojis. What isn't helped by the fact that
    they get sick very easily and somewhat often. Their tail gives them stability, their beak is an adaptation
    to make them call for your attention louder, and their ears are really cute.`,
    time_info:"<b>Average lifespam</b>: 10 years",

    food: 8,
    fun: 7,
    sick: 1,
    weight: 8,
    sleep: 2,
    wake:2
}

pet_stat_array["3-f"] = {
    name:"Plantoji",
    text:`They spend a lot of time in the sun and draining energy from the soil, but that simply ain't enough.
    Who would guess that a plant Tamajoji could be so hard to take care of? They sleep a lot, need a lot
    of food, and a lot of play, aside from having a relatively short lifespam. `,
    time_info:"<b>Average lifespam</b>: 7 years",

    food: 10,
    fun: 8,
    sick: 3,
    weight: 10,
    sleep: 2,
    wake:4
}



pet_stat_array["4-a"] = {
    name:"Joneji",
    text:`Legends say they can predict the future. I say it's just a lot of lucky guesses.`,
    time_info:"<b>Average lifespam</b>: 20 years",

    food: 3,
    fun: 2,
    sick: 6,
    weight: 6,
    sleep: 1,
    wake:4
}

pet_stat_array["4-b"] = {
    name:"Guga",
    text:`"Roses are red <br>
           I don't need a master <br>
           Rhyming is lame <br>
           Omega Blaster! <br>
           <br>           
        -The Guga Song`,
    time_info:"<b>Average lifespam</b>: 15 years",

    food: 6,
    fun: 7,
    sick: 5,
    weight: 8,
    sleep: 7,
    wake:5
}

pet_stat_array["4-c"] = {
    name:"Doji",
    text:`Doesn't enjoy playing around, but it's still the sweetest thing.`,
    time_info:"<b>Average lifespam</b>: 15 years",

    food: 8,
    fun: 1,
    sick: 3,
    weight: 5,
    sleep: 1,
    wake:3
}

function get_RGB_array(rgb){
    let rgb_array = rgb.substring(4, rgb.length-1)
                        .replace(/ /g, '')
                        .split(',');

    return rgb_array;
}

function resize_bar(bar_name, new_value, min_color,mid_color,max_color){
    let bar = document.querySelector("."+bar_name + "_stat_bar");
    const full_size = 132;
    let target_size = (full_size/max_stat_limit[bar_name])*new_value;

    bar.style.width = target_size + "px";

    //color control
    let bar_percentage = target_size/full_size;
    let is_past_half = (bar_percentage > 0.5)


    let recalculated_percentage;

    let low_color;
    let high_color;



    if(is_past_half){
        low_color = mid_color;
        high_color = max_color;
        recalculated_percentage = 2*(bar_percentage - 0.5)
    }else{
        low_color = min_color;
        high_color = mid_color;
        recalculated_percentage = 2*(bar_percentage)
    }

    let low_color_dominance  = 1 - recalculated_percentage;
    let high_color_dominance = recalculated_percentage;
    //let min_color_dominance = (1 - bar_percentage);
    //let max_color_dominance = bar_percentage;

    let color_array_low  = get_RGB_array(low_color);
    let color_array_high = get_RGB_array(high_color);

    let result_rgb = Array();

    
    result_rgb[0] = low_color_dominance* color_array_low[0] + high_color_dominance* color_array_high[0];
    result_rgb[1] = low_color_dominance* color_array_low[1] + high_color_dominance* color_array_high[1];
    result_rgb[2] = low_color_dominance* color_array_low[2] + high_color_dominance* color_array_high[2];

    bar.style.backgroundColor = "rgb("+result_rgb[0]+","+result_rgb[1]+","+result_rgb[2]+")";

    console.log(bar_name+":" +recalculated_percentage);
    
}

function change_current_values(pet_code){
    let pet = pet_stat_array[pet_code];
    current_selected_values.name        = pet.name;
    current_selected_values.text        = pet.text;
    current_selected_values.time_info   = pet.time_info;

    current_selected_values.food   = pet.food;
    current_selected_values.fun    = pet.fun;
    current_selected_values.sick   = pet.sick;
    current_selected_values.weight = pet.weight;
    current_selected_values.sleep  = pet.sleep;
    current_selected_values.wake   = pet.wake;
}

function update_bars(){
    let good_color    = "rgb(0,255,0)";
    let mid_color     = "rgb(255,255,0)";
    let bad_color     = "rgb(255,0,0)";
    let neutral_color = "rgb(114, 137, 218)";

    resize_bar("food"  , current_selected_values.food  , good_color, mid_color, bad_color);
    resize_bar("fun"   , current_selected_values.fun   , good_color, mid_color , bad_color);
    resize_bar("sick"  , current_selected_values.sick  , bad_color , mid_color , good_color);
    resize_bar("weight", current_selected_values.weight, neutral_color, neutral_color, neutral_color);
    resize_bar("sleep" , current_selected_values.sleep , good_color, mid_color , bad_color);
    resize_bar("wake"  , current_selected_values.wake  , good_color, mid_color , bad_color);
}
 
function update_name(){
    let name_box = document.querySelector(".name_box");
    name_box.innerHTML = current_selected_values.name;
}

function update_text(){
    let text_box = document.querySelector(".text_box");
    text_box.innerHTML = current_selected_values.text;
}

function update_time_info_box(){
    console.log("passou");
    let time_info_box = document.querySelector(".time_info_box");
    time_info_box.innerHTML = current_selected_values.time_info;
    console.log(time_info_box);
}

function change_selected_box_frame(index){
    let select_box = document.querySelectorAll(".selection_box");
    select_box.forEach(function(box){
        box.classList.remove("selection_box_selected");
    })

    select_box.forEach(function(box){
        if(box.getAttribute("value") == index){
            console.log(box);
            box.classList.add("selection_box_selected");
        } 
    })
}

function change_image(index){
    let image_box = document.querySelector(".selected_pet_image");
    image_box.src="./images/pet_stages/"+index+".png";
}



function click_info_box(index){
    //update logical values
    change_current_values(index);

    //update displays
    change_image(index);
    update_name();
    update_text();
    update_time_info_box();
    update_bars();

    change_selected_box_frame(index);
}

function init_box_onclick(){
    let select_box = document.querySelectorAll(".selection_box");
    select_box.forEach(function(box){
        console.log();
        box.onclick = () => {
            click_info_box(box.getAttribute("value"));
        }
    })
}

function start(){
    //resize_bar("food", 10, "rgb(255,128, 0)", "rgb(128, 255, 0)");
    init_box_onclick();
}

start();