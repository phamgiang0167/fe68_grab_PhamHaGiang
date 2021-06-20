document.getElementById('calculate').addEventListener('click', function(){
    action(this.id)
    
})
document.getElementById('printBill').addEventListener('click', function(){
    action(this.id)
})

function action(action){
    var type = getGrabType()
    var km = getDistance()
    var waiting = getWaitingTime()
    if(!type || !km || !waiting){
        alert("Một vài trường thiếu hoặc không hợp lệ!!!")
        return
    }
    if(action == "calculate"){
        calculatePrice(type, km, waiting)
    }else{
        createBill(type, km, waiting)
    }
}


/** 
 * _1: 0 to 1
 * _2: 1 to 19
 * _3: more than 19
 * */ 

var price = {
    "grabCar": {
        "_1": 8000,
        "_2": 7500,
        "_3":7000,
        "_waiting": 2000
    },
    "grabSUV": {
        "_1": 9000,
        "_2": 8500,
        "_3":8000,
        "_waiting": 3000
    },
    "grabBlack": {
        "_1": 10000,
        "_2": 9500,
        "_3":9000,
        "_waiting": 3500
    },
}

function calculatePrice(typeGrab, distance, waitingTime){
    var total = 0
    if(distance >=0 && distance <=1){
        total = price[typeGrab]._1*distance
    }else if(distance > 1 && distance <= 19){
        total = price[typeGrab]._1 + price[typeGrab]._2*(distance - 1)
    }else{
        total = price[typeGrab]._1 + price[typeGrab]._2*18 + price[typeGrab]._2*(distance - 19)
    }

    if(waitingTime > 3){
        total += Math.round(waitingTime/3)*price[typeGrab]._waiting
    }
    document.getElementById('divThanhTien').style.display = 'block'
    document.getElementById('xuatTien').innerHTML = total
}

function fillingBill(stage, typeGrab, total, distance){
    document.getElementById("stage" + stage).innerHTML = distance
    document.getElementById("price" + stage).innerHTML = price[typeGrab][stage]
    document.getElementById("total" + stage).innerHTML = total
}

function createBill(typeGrab, distance, waitingTime){
    var total_3 = 0 // total price (more than 19km)
    var total_2 = 0 // total price (1km to 19km)
    var total_1 = 0 // total price (0km to 1km)
    var total_waiting = 0 // total price for waitting time

    // price details for distance over 19km
    if(distance > 19){
        total_3 = (distance - 19)*price[typeGrab]._3
        fillingBill('_3', typeGrab, total_3, distance - 19)
        distance = 19
    }else{
        fillingBill('_3', typeGrab, 0, 0)
    }

    // price details for distance from 1km to 19km
    if(distance > 1 && distance <= 19){
        total_2 = (distance - 1)*price[typeGrab]._2
        fillingBill('_2', typeGrab, total_2, distance - 1)
        distance = 1
    }else{
        fillingBill('_2', typeGrab, 0, 0)
    }

    // price details for distance from 0km to 1km
    if(distance > 0 && distance <= 1){
        total_1 = distance*price[typeGrab]._1
        fillingBill('_1', typeGrab, total_1, distance)
    }else{
        fillingBill('_1', typeGrab, 0, 0)
    }

    // price details for waiting time
    if(waitingTime > 3){
        total_waiting = Math.round(waitingTime/3)*price[typeGrab]._waiting
        fillingBill('_waiting', typeGrab, total_waiting, waitingTime)   
    }else{
        fillingBill('_waiting', typeGrab, 0, waitingTime)   
    }
    
    document.getElementById('total').innerHTML = "TỔNG TIỀN: " + parseInt(total_1 + total_2 + total_3 + total_waiting)
    document.getElementById('bill').style.display = 'table'
}

function getGrabType(){
    var options = document.getElementsByClassName('type')
    for(var i = 0; i < options.length; i++){
        var radioBox = options[i].querySelector('input')
        if(radioBox.checked){
            return radioBox.value
        }
    }
    return false
}

function getDistance(){
    var distance = document.querySelector('input[id="km"]')
    if(distance.value < 0 || !isNumber(distance.value)){
        return false
    }
    return distance.value
}

function getWaitingTime(){
    var time = document.querySelector('input[id="time"]')
    if(time.value < 0 || !isNumber(time.value)){
        return false
    }
    return time.value
}

function isNumber(n) { 
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
} 
