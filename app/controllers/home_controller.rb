class HomeController < ApplicationController
  protect_from_forgery :except => :auth_pusher
    
  def index
  end
  
  def set_nickname
      #debugger
      session[:nickname] = params[:nickname]["Nickname"]
      redirect_to messages_path
  end
  

  def auth_pusher 
    if session[:nickname] && !session[:nickname].blank?

      response = Pusher[params[:channel_name]].authenticate(params[:socket_id], {
        :user_id => (1 + rand(99999)),
        :user_info => { # => optional - for example
          :nickname => session[:nickname],
          :color => "%06x" % (rand * 0xffffff)
        }
      })
      
      @message = Message.create(nickname:'Server', message:"#{session[:nickname]} has joined.")
      Pusher['presence-room1'].trigger('new_message', {
          message: @message.message,
          nickname: @message.nickname,
          time: @message.created_at.to_formatted_s(:short),
          
      })
        
      render :json => response
    else
      render :text => "Forbidden", :status => '403'
    end

  end
  
end
