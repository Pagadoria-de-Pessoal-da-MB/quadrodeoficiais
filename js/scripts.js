
$(document).ready(function() {
    // Verifica o hash da URL e exibe os modais correspondentes
    if (window.location.hash === '#loginModal') {
        $('#loginModal').modal('show');
    } else if (window.location.hash === '#successModal') {
        $('#successModal').modal('show');
    } else if (window.location.hash === '#passwordChangeSuccessModal') {
        $('#passwordChangeSuccessModal').modal('show');
    } 

 // Fun��o para adicionar um usu�rio
$('#addUserForm').submit(function(event) {
    event.preventDefault();
    var formData = $(this).serialize();

    $.ajax({
        url: 'views/process_add_user.php', // URL do script PHP
        type: 'POST',
        data: formData,
        success: function(response) {
            try {
                response = JSON.parse(response);
                if (response.status === 'success') {
                    $('#addUserModal').modal('hide');
                    $('#userAddSuccessModal').modal('show');
                } else if (response.status === 'error') {
                    $('#userAddErrorModal').modal('show');
                  
                } else {
                    console.error('Status desconhecido:', response.status);
                }
            } catch (e) {
                console.error('Erro ao analisar a resposta do servidor:', e);
                alert('Erro ao processar a resposta do servidor. Verifique o console para mais detalhes.');
            }
        },
        error: function() {
            alert('Erro ao adicionar o usu�rio.');
        }
    });
});
$('#addUserModal').on('hidden.bs.modal', function () {
    $('#addUserForm')[0].reset();
    $('#usernameError').text('');
});

    // C�digo para adicionar oficial
    $('#addOfficialForm').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.post('views/process_add_official.php', formData, function(response) {
            $('#addOfficialModal').modal('hide');
            $('#oficialSuccessModal').modal('show');
            $('#oficialSuccessModal').on('hidden.bs.modal', function () {
                window.location.reload();
            });
        }).fail(function() {
            alert('Erro ao adicionar oficial.');
        });
    });

    $('#addOfficialModal').on('hidden.bs.modal', function () {
        $('#addOfficialForm')[0].reset();
    });

    // C�digo para editar oficial
    $('#editOfficialForm').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.post('views/process_edit_official.php', formData, function(response) {
            $('#editOfficialModal').modal('hide');
            $('#editSuccessModal').modal('show');
            $('#editSuccessModal').on('hidden.bs.modal', function () {
                window.location.reload(); // Recarrega a p�gina quando o modal de sucesso for fechado
            });
        }).fail(function() {
            alert('Erro ao editar oficial.');
        });
    });

    $('#editOfficialModal').on('hidden.bs.modal', function () {
        $('#editOfficialForm')[0].reset();
    });






    // Fun��o para atualizar o status de presen�a
    window.togglePresence = function(id) {
        // Verifica se o usuário está autenticado
     
    
        // Seleciona o checkbox baseado no ID fornecido
        var checkbox = document.querySelector('input[data-id="' + id + '"]');
        if (!checkbox) {
            console.error('Checkbox com ID ' + id + ' não encontrado.');
            return; // Garante que a função seja interrompida aqui
        }
    
        // Define o status com base no estado atual do checkbox
        var status = checkbox.checked ? 'bordo' : 'terra';
    
        // Envia o status atualizado para o servidor via AJAX
        $.ajax({
            url: 'views/update_status_file.php',
            type: 'POST',
            data: { id: id, status: status },
            success: function(response) {
                console.log(response); // Para ver a resposta do servidor no console
                if (response !== 'Status atualizado com sucesso.') {
                    alert('Falha ao atualizar o status: ' + response);
                    checkbox.checked = !checkbox.checked; // Reverte a mudança se falhar
                }
                // Atualiza a cor do toggle após o AJAX
                updateToggleColor(checkbox);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Somente usuários logados ');
                checkbox.checked = !checkbox.checked; // Reverte a mudança se falhar
                // Atualiza a cor do toggle após o erro
                updateToggleColor(checkbox);
            }
        });
    };


    
    // Fun��o para atualizar a numera��o na tabela
    function atualizarNumeracao() {
        $('.table tbody tr').each(function(index) {
            $(this).find('td:first').text(index + 1);
        });
    }

    // Fun��o para excluir oficial
    window.excluirOficial = function(id) {
        if (confirm("Tem certeza que deseja excluir este oficial?")) {
            $.ajax({
                url: "views/remove_official.php",
                type: "POST",
                data: { id: id },
                success: function(response) {
                    atualizarNumeracao();
                    location.reload();
                },
                error: function() {
                    alert("Falha ao excluir oficial.");
                }
            });
        }
    }

    // Fun��o para atualizar a data e hora
    function updateDateTime() {
        const now = new Date();
        var days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const dayName = days[now.getDay()];
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        const dateTimeString = now.toLocaleDateString('pt-BR', options);
        const dateTimeWithDay = `${dayName}, ${dateTimeString}`; // Adiciona o nome do dia da semana à string de data e hora
    
        document.getElementById('datetime').textContent = dateTimeWithDay;
    }

    // Chama a fun��o updateDateTime a cada segundo
    setInterval(updateDateTime, 1000);
    updateDateTime();




    document.addEventListener('DOMContentLoaded', function() {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            // Não atualiza a cor do toggle aqui
    
            checkbox.addEventListener('change', function() {
                // Verifica se o usuário está autenticado antes de chamar a função
                if (!userIsAuthenticated) {
                    // Reverte a mudança do checkbox
                    checkbox.checked = !checkbox.checked;
                    // Mostra um alerta informando que o usuário precisa estar logado
                    alert('Você precisa estar logado para realizar essa ação.');
                    return;
                }
    
                // Chama a função para alterar a presença
                togglePresence(checkbox.dataset.id);
    
                // Atualiza a cor do toggle após a mudança do checkbox
                updateToggleColor(checkbox);
            });
    
            // Atualiza a cor do toggle inicial apenas uma vez
            updateToggleColor(checkbox);
        });
    });
    

    // Atualiza a cor do toggle com base no estado do checkbox
    function updateToggleColor(checkbox) {
        var slider = checkbox.nextElementSibling;
        if (checkbox.checked) {
            slider.style.backgroundColor = 'green';
        } else {
            slider.style.backgroundColor = 'red';
        }
    }

   

    // Fun��o para redefinir a senha do usu�rio
    $('#resetPasswordForm').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();

        $.ajax({
            url: 'views/process_reset_user_password.php',
            type: 'POST',
            data: formData,
            success: function(response) {
                try {
                    response = JSON.parse(response);
                    if (response.status === 'success') {
                        $('#resetPasswordSuccessModal').modal('show');
                        // Limpa a vari�vel de sess�o no lado do cliente, se necess�rio
                        window.location.hash = ''; // Opcional: Remove o hash da URL ap�s exibir o modal
                    } else {
                     
                        $('#passwordErrorMessage').text(response.message);
                    }
                } catch (e) {
                    console.error('Erro ao analisar a resposta do servidor:', e);
                    alert('Erro ao processar a resposta do servidor. Verifique o console para mais detalhes.');
                }
            },
            error: function() {
                alert('Erro ao redefinir a senha.');
            }
        });
  
  

    // C�digo para exibir modais com base no hash da URL
    if (window.location.hash === '#resetPasswordSuccessModal') {
        $('#passwordChangeSuccessModal').modal('show');
    } else if (window.location.hash === '#passwordErrorModal') {
        $('#passwordErrorModal').modal('show');
    }
 

  
});
    $('#resetUserPasswordModal').on('hidden.bs.modal', function () {
        $('#resetUserPasswordForm')[0].reset();
    });

    // Fun��o para abrir o modal de adicionar oficial
    window.abrirModalAdicionar = function(localizacao) {
        $('#addOfficialModal').modal('show');
        $('#localizacao').val(localizacao + 1);

        var linhaAtual = $('#row-' + localizacao);
        var linhaProxima = linhaAtual.next('tr');

        var textoAntes = linhaAtual.find('.name-column').text();
        var textoDepois = linhaProxima.length ? linhaProxima.find('.name-column').text() : 'N/A';

        $('#addOfficialMessage').text('Adicionando oficial entre ' + textoAntes + ' e ' + textoDepois);

        $('.highlight').removeClass('highlight');
        linhaAtual.addClass('highlight');
    }

    // Fun��o para abrir o modal de editar oficial
    window.abrirModalEditar = function(id, nome, posto_id, status, localizacao) {
        $('#editOfficialModal').modal('show');
        $('#edit_id').val(id);
        $('#edit_nome').val(nome);
        $('#edit_posto').val(posto_id);
        $('#edit_status').val(status);
        $('#edit_localizacao').val(localizacao);
    }

    // Inicializa o Select2 para o modal de adicionar oficial
    $('#addOfficialModal').on('shown.bs.modal', function () {
        $('#posto').select2({
            templateResult: formatOption,
            templateSelection: formatOption
        });
    });
    $('#resetUserPasswordModal').on('shown.bs.modal', function () {
        $('#reset_username').select2();
    });

    function formatOption(option) {
        if (!option.id) {
            return option.text;
        }
        var imgSrc = $(option.element).data('img');
        return $('<span><img src="' + imgSrc + '" style="width: 40px; height: 20px; margin-right: 10px;" /> ' + option.text + '</span>');
    }


    
});
