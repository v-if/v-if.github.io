// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
    searching: false, paging: false, info: false, ordering: false,
    columns: [
      { data: 'round' },
      { data: 'repayment',
        render: function(data, type, row, meta) {
          return Math.round(data).toLocaleString('ko-KR');
        }
      },
      { data: 'payment',
        render: function(data, type, row, meta) {
          return Math.round(data).toLocaleString('ko-KR');
        }
      },
      { data: 'interest',
        render: function(data, type, row, meta) {
          return Math.round(data).toLocaleString('ko-KR');
        }
      },
      { data: 'balance',
        render: function(data, type, row, meta) {
          return Math.round(data).toLocaleString('ko-KR');
        }
      }
    ],
    columnDefs: [
      { className: "text-center", "targets": [0] },
      { className: "text-right", "targets": [1,2,3,4] }
    ],
    language: {
      paginate: {
        next: ">",
        previous: "<"
      }
    }
  });

});
