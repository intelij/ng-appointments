(function () {
    'use strict';

    angular
        .module('app.appointments')
        .controller('Appointments', Appointments);

    Appointments.$inject = ['$q', 'dataservice', 'logger', '$uibModal'];

    function Appointments($q, dataservice, logger, $uibModal) {

        /*jshint validthis: true */
        var vm = this;

        vm.appointmentsCount = 0;
        vm.appointments = [];

        vm.calendarTitle = 'Appointments';
        vm.calendarView = 'week';
        vm.calendarDay = new Date();

        vm.editEventIcon = '<\i class=\'fa fa-pencil\'\></i>';
        vm.deleteEventIcon = '<\i class=\'fa fa-times\'\></i>';

        vm.eventDetails = function(appointment) {
            showModal('details', appointment);
        };

        vm.eventEdit = function(appointment) {
            showModal('edit', appointment);
        };

        vm.eventDelete = function(appointment) {
            showModal('delete', appointment);
        };

        activate();

        function activate() {
            var promises = [generateAppointments(), getAppointmentsCount()];
//            Using a resolver on all routes or dataservice.ready in every controller
//            return dataservice.ready(promises).then(function(){
            return $q.all(promises).then(function () {
                logger.info('Activated Appointments View');
            });
        }

        function getAppointmentsCount() {
            return dataservice.getAppointmentsCount().then(function (data) {
                vm.appointmentsCount = data;
                return vm.appointmentsCount;
            });
        }

        // @TODO: use getAppointments() dataservice

        function generateAppointments() {
            return dataservice.generateAppointments().then(function (data) {
                vm.appointments = data;
                return vm.appointments;
            });
        }

        function showModal(type, appointment) {
            $uibModal.open({
                templateUrl: 'appointmentModal.html',
                controller: function() {
                    var vm = this;
                    vm.type = type;
                    vm.appointment = appointment;
                },
                controllerAs: 'vm'
            });
        }
    }
})();