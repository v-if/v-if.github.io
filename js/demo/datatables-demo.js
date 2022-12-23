// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
    columns: [
      { data: 'a',
        render: function(data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        }
      },
      { data: 'b' },
      { data: 'c' },
      { data: 'd' },
      { data: 'e' },
      { data: 'f' }
    ],
    columnDefs: [
      { className: "text-center", "targets": [0] },
      { className: "text-right", "targets": [1,2,3,4,5] }
    ],
    language: {
      paginate: {
        next: ">",
        previous: "<"
      }
    }
  });

});
