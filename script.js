

const addTask = (newTask) => {
  $('.task-container').append('<div class="task-wrapper row list">' +
    '<div class="col-1 task-border task-check">' +
    '<a class="completeTask" href="#"><i class="fas fa-check"></i></a>' + '</div>' +
    '<div class="task-background col-10">' +
    '<p class="task-title">' + newTask + '</p></div>' +               
    '<div class="col-1 task-border">' +
    '<a class="remove" href="#">X</a>' +                
    '</div></div>');
};

const addTaskCompleted = (newTask) => {
  $('.task-container').append('<div class="task-wrapper fadedOut row list">' +
    '<div class="col-1 task-border task-check">' +
    '<a class="completeTask checkGreen" href="#"><i class="fas fa-check"></i></a>' + '</div>' +
    '<div class="task-background col-10">' +
    '<p class="task-title">' + newTask + '</p></div>' +               
    '<div class="col-1 task-border">' +
    '<a class="remove" href="#">X</a>' +                
    '</div></div>');
}

const updateList = () => {
  $('.task-container').children().remove()
  $.ajax({
    type: 'GET',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=141',
    dataType: 'json',
    success: function (response, textStatus) {
      console.log(response);
      tasksArr = response;
      console.log('tasksArr.tasks.length: ' + tasksArr.tasks.length);
      for ( i = 0; i < tasksArr.tasks.length; i++) {
        console.log('i: ' + i);
        console.log('tasksArr.tasks[i].content: ' + tasksArr.tasks[i].content)
        console.log('tasksArr.tasks[i].completed: ' + tasksArr.tasks[i].completed)
        if (tasksArr.tasks[i].completed) {
          addTaskCompleted(tasksArr.tasks[i].content);
        } else {
          addTask(tasksArr.tasks[i].content);
        }                
      } 
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}


let tasksArr = [];

$(document).ready(function () {

  console.log('Document ready.')
  updateList();
  $(document).on('click', '.remove', function () {
    let taskTitle = $(this).closest('.task-wrapper').find('.task-title').text()
    let deleteDiv = $(this).parent().parent();
    //console.log(deleteDiv)
    //console.log(taskTitle);
    let taskObj = tasksArr.tasks.filter(obj => {
      return obj.content === taskTitle;
    })
    //console.log('taskObj: ' + taskObj[0].id);
    let deleteID = taskObj[0].id;
    //console.log(deleteID);
    $.ajax({
      type: 'DELETE',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + deleteID + '?api_key=141',
      success: function (response, textStatus) {
        $(deleteDiv).remove();
        console.log('Deleted: ' + deleteID);
        $('#newTask').val('');
        updateList();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });        
  }); 

  $(document).on('click', '.completeTask', function () {
    console.log('Task Complete CLicked!');
    let taskWrapper = $(this).closest('.task-wrapper')
    taskWrapper.toggleClass('fadedOut')
    $(this).toggleClass('checkGreen');
    let checked = $(this).hasClass('checkGreen')
    console.log('checked: ' + checked);
    let taskTitle = $(this).closest('.task-wrapper').find('.task-title').text()
    console.log('taskTitle: ' + taskTitle); 
    let taskObj = tasksArr.tasks.filter(obj => {
      return obj.content === taskTitle;
    })
    console.log(taskObj);
    let completedID = taskObj[0].id;
    console.log('completedID: ' + completedID);
    if (checked) {
      $.ajax({
        type: 'PUT',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + completedID + '/mark_complete?api_key=141',
        dataType: 'json',
        success: function (response, textStatus) {
          console.log(response);
          updateList();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
     });
    } else {
      $.ajax({
        type: 'PUT',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + completedID + '/mark_active?api_key=141',
        dataType: 'json',
        success: function (response, textStatus) {
          console.log(response);
          updateList();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
     });
    } 
  }); 

  $('.task-form').on('submit', function (event) {
    event.preventDefault();
    var newTask = $(this).children('#newTask').val();
    //console.log(newTask);
    $.ajax({
      type: 'POST',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=141',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: `${newTask}`,
        }
      }),
      success: function (response, textStatus) {
        //console.log(response);
        addTask(newTask);
        $('#newTask').val('');
        updateList();
      },
      error: function (request, textStatus, errorMessage) {
        //console.log(errorMessage);
      }
    });     
  }); 
});



         
               
            













//httpRequest.open('GET', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/3503?api_key=1');
/* httpRequest.open('POST', 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=1');

//httpRequest.send();

httpRequest.setRequestHeader("Content-Type", "application/json");

httpRequest.send(JSON.stringify({
  task: {
    content: "Wash laundry"
  }
})); */


// *** PUT UPDATE VALUE ***
/* httpRequest.open('PUT', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/3528?api_key=1');
httpRequest.setRequestHeader("Content-Type", "application/json");
httpRequest.send(JSON.stringify({
  task: {
    content: "Wash dirty laundry"
  }
}));*/


// *** PUT CHANGE TO COMPLETE
/* httpRequest.open('PUT', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/3528/mark_complete?api_key=1');
httpRequest.send(); */

// *** PUT CHANGE TO FALSE
/* httpRequest.open('PUT', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/3528/mark_active?api_key=1');
httpRequest.send(); */

// *** DELETE REQUEST
/* httpRequest.open('DELETE', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/3528?api_key=1');
httpRequest.send(); */

// *** JQuery AJAX POST REQUEST

/* $.ajax({
    type: 'POST',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=1',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: 'Wash dirty dishes'
      }
    }),
    success: function (response, textStatus) {
      console.log(response);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  }); */


// *** JQuery AJAX PUT REQUEST  
  /* $.ajax({
    type: 'PUT',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/3529?api_key=1',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: 'Wash very dirty dishes!'
      }
    }),
    success: function (response, textStatus) {
      console.log(response);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  }); */

  // *** JQuery AJAX DELETE REQUEST

  /* $.ajax({
    type: 'DELETE',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/3529?api_key=1',
    success: function (response, textStatus) {
      console.log(response);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  }); */
