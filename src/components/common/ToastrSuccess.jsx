import toastr from "toastr";

const ToastrSuccess = ({ successMessage }) => {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: "200",
    hideDuration: "500",
    timeOut: "3000",
    extendedTimeOut: "500",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
  toastr.clear();
  setTimeout(() => toastr.success(successMessage, `Success!`), 300);
};

export default ToastrSuccess;
