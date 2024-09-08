// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import $ from "jquery";

$(function(){
    

    function LoadComponent(page){
        $.ajax({
            method:'get',
            url:page,
            success:(response)=>{
                $("main").html(response);
            }
        })
    }

    function LoadAppointments(uid){
        $('#appointmentsContainer').html("");
        $.ajax({
            method:'get',
            url:`http://localhost:6060/appointments/${uid}`,
            success:(appointments)=>{
               $("#UserIdContainer").append(`<span>${sessionStorage.getItem("username")}</span>`)

               appointments.map(item=>{
                  $(`
                    <div class="alert alert-dismissible alert-success">
                         <h2>${item.Title}</h2>
                         <button value=${item.Id} id="btnDelete" class="btn btn-close"></button>
                         <p>${item.Description}</p>
                         <div>
                         <span class="bi bi-clock"></span>${item.Date}
                         </div>
                         <div class="text-end">
                            <button value=${item.Id} id="btnEdit" class="btn btn-warning bi bi-pen"> Edit</button>
                         </div>
                    </div>
            
                    `).appendTo("#appointmentsContainer")
               })
            }
           })
    }



    $('#btnHomeLogin').click(()=>{
       LoadComponent('login.html');
    })

    $("#btnHomeRegister").click(()=>{
        LoadComponent('register.html');
    })
    // $("#btnNavRegister").click(()=>{
    //     LoadComponent('register.html');
    // })
    // $("#btnNavLogin").click(()=>{
    //     LoadComponent('login.html');
    // })

    $(document).on("click","#btnNavRegister",()=>{
        LoadComponent('register.html');
    })
    $(document).on("click","#btnNavLogin",()=>{
        LoadComponent('login.html');
    })



    $(document).on("click","#btnLogin",()=>{
        $.ajax({
            mathod:'get',
            url:'http://localhost:6060/users',
            success:(users)=>{
                // console.log(users);
                // console.log($("#UserId").val());

                var user=users.find(item=> item.UserId===$("#UserId").val());
                // console.log(user);
                if(user.Password===$("#Password").val()){
                    sessionStorage.setItem("username",user.UserName);
                    sessionStorage.setItem("userid",user.UserId);
                    // username is a key .
                    // sessionStorage is not accesscible in other tab it is only accessible in this tab only
                    LoadComponent('appointments.html');
                    LoadAppointments($("#UserId").val());
                //    $.ajax({
                //     method:'get',
                //     url:`http://localhost:6060/appointments/${$("#UserId").val()}`,
                //     success:(appointments)=>{
                //        $("#UserIdContainer").append(`<span>${sessionStorage.getItem("username")}</span>`)

                //        appointments.map(item=>{
                //           $(`
                //             <div class="alert alert-dismissible alert-success">
                //                  <h2>${item.Title}</h2>
                //                  <button class="btn btn-close"></button>
                //                  <p>${item.Description}</p>
                //                  <div>
                //                  <span class="bi bi-clock"></span>${item.Date}
                //                  </div>
                //             </div>
                    
                //             `).appendTo("#appointmentsContainer")
                //        })
                //     }
                //    })
                }else{
                    $("#lblError").html('Invalid Credentials');
                }
            }
        })
    })
    $(document).on("click","#btnSignout",()=>{
        sessionStorage.removeItem("username");
        LoadComponent('login.html');
    })

    // Register Button Logic
    $(document).on("click", "#RbtnRegister",()=>{
        var user = {
            UserId: $("#RUserId").val(),
            UserName: $("#RUserName").val(),
            Password: $("#RPassword").val(),
            Email: $("#REmail").val(),
            Mobile: $("#RMobile").val()
        };
        $.ajax({
            method: 'post',
            url: 'http://127.0.0.1:6060/register-user',
            data: user
        })
        alert('Registered Successfully..');
        LoadComponent('login.html');
    })


    // Adding New Appointmetn

    $(document).on("click","#btnNewAppointment",()=>{
        LoadComponent('new-appointment.html');
    })

    $(document).on("click","#btnAddNewTask",()=>{
        var appointment={
            Id:$("#AId").val(),
            Title:$("#ATitle").val(),
            Description:$("#ADescription").val(),
            Date:$("#ADate").val(),
            UserId:sessionStorage.getItem("userid")
        }
        $.ajax({
           method: "post",
           url:'http://127.0.0.1:6060/add-task',
           data:appointment
        })
        alert('Appointment Added Successfully..');
        LoadComponent('appointments.html');
        LoadAppointments(appointment.UserId);
    })

    $(document).on("click","#btnDelete",(e)=>{
        var flag=confirm("Are You sure/n want to delete?");
    //   alert(e.target.value);
    if(flag==true){
        $.ajax({
            method:'delete',
            url:`http://127.0.0.1:6060/delete-task/${e.target.value}`
        })
        alert('Deleted Successfully..');
        LoadAppointments(sessionStorage.getItem("userid"));
    }
    })


// Edit Appointments
   $(document).on("click","#btnEdit",(e)=>{
    LoadComponent("edit-appointment.html");
    $.ajax({
        method:'get',
        url:`http://127.0.0.1:6060/get-byid/${e.target.value}`,
        success:(appointments)=>{
            $("#ETitle").val(appointments[0].Title);
            $("#EDescription").val(appointments[0].Description);
            $("#EDate").val();
        }
    })
   })

    // if an element inside another element then the 
    // jquery can not access that element directly with reference id
    // we have to use document.on method
});

// main