document.getElementById("calculate").addEventListener('click', function(){
    action(this.id)
})
document.getElementById("printBill").addEventListener('click', function(){
    action(this.id)
})

function action(action){
    console.log(action)
    //get data
    let typeGrab = getGrabType()
    let distance = getDistance()
    let waitingTime = getWaitingTime()

    //price table
    let price = {
        "grabCar": {
            "first": 8000,
            "second": 7500,
            "third":7000,
            "waiting": 2000
        },
        "grabSUV": {
            "first": 9000,
            "second": 8500,
            "third":8000,
            "waiting": 3000
        },
        "grabBlack": {
            "first": 10000,
            "second": 9500,
            "third":9000,
            "waiting": 3500
        },
    }

    //validate data
    if(!typeGrab || !distance || !waitingTime){
        alert("Một vài trường thiếu hoặc không hợp lệ!!!")
        document.getElementById('divThanhTien').style.display = 'none'
        document.getElementById('bill').style.display = 'none'
        return
    }

    // declare a bill object 
    /*Bill("price of distance 0 to 1",
            "price of distance 1 to 19",
            "price of distance more than 19",
            distance,
            waitting time)
    */ 
    let bill = new Bill(price[typeGrab].first, price[typeGrab].second, price[typeGrab].third, price[typeGrab].waiting, distance, waitingTime)

    // check options
    if(action == "calculate"){
        // payment
        document.getElementById('divThanhTien').style.display = "block"
        document.getElementById('xuatTien').innerHTML = bill.getTotalPrice().toString()
    }else{
        // print bill
        let billDetail = bill.getBillDetail()
        for (var key in billDetail) {
            if(key == "waiting"){
                fillingBill(key, billDetail[key].waitingTime, billDetail[key].price, price[typeGrab][key])
            }else if(key != "totalPrice"){
                fillingBill(key, billDetail[key].distance, billDetail[key].price, price[typeGrab][key])
            }else{
                document.getElementById('total').innerHTML = billDetail[key]
            }   
        }
        document.getElementById('bill').style.display = "table"
    }
}

function fillingBill(stage, number, price, priceGrab){
    document.getElementById("stage_" + stage).innerHTML = number
    document.getElementById("price_" + stage).innerHTML = priceGrab
    document.getElementById("total_" + stage).innerHTML = price
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


function Bill(priceFirst, priceSecond, priceThird, priceWaitingTime, totalDistance, waitingTime){
    let billDetail = function(){
        let billDetail = {
            first: {},
            second: {},
            third: {},
            waiting: {},
            totalPrice: 0
        }

        let distance = totalDistance
        // price details for distance over 19km
        if(distance > 19){
            billDetail.third.price = (distance - 19)*priceThird
            billDetail.third.distance = distance - 19
            distance = 19
        }else{
            billDetail.third.price = 0
            billDetail.third.distance = 0
        }
    
        // price details for distance from 1km to 19km
        if(distance  > 1 && distance  <= 19){
            billDetail.second.price = (distance - 1)*priceSecond
            billDetail.second.distance= distance - 1
            distance = 1
        }else{
            billDetail.second.price = 0
            billDetail.second.distance = 0
        }
    
        // price details for distance from 0km to 1km
        if(distance > 0 && distance <= 1){
            billDetail.first.price= distance*priceFirst
            billDetail.first.distance = distance
        }
    
        // price details for waiting time
        if(waitingTime > 3){
            billDetail.waiting.price = Math.floor(waitingTime/3)*priceWaitingTime
            billDetail.waiting.waitingTime = waitingTime
        }else{
            billDetail.waiting.price = 0
            billDetail.waiting.waitingTime = waitingTime
        }

        // total price
        billDetail.totalPrice = billDetail.first.price + 
                                billDetail.second.price + 
                                billDetail.third.price +
                                billDetail.waiting.price
        return billDetail
    }

    let totalPrice = billDetail().totalPrice

    this.getBillDetail = function(){
        return billDetail()
    }

    this.getTotalPrice = function(){
        return totalPrice
    }
}