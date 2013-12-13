include ActionView::Helpers::SanitizeHelper
include ActionView::Helpers::TextHelper

class MessagesController < ApplicationController
  before_action :set_message, only: [:show, :edit, :update, :destroy]

  # GET /messages
  # GET /messages.json
  def index
    @nickname ||= session[:nickname]
    @messages = Message.order("created_at desc").limit(20).reverse
    
    @drawing = Drawing.all.to_json
  end



  # POST /messages
  # POST /messages.json
  def create
    @nickname ||= session[:nickname]
    
    text_message = process_message message_params[:message]
    
    @message = Message.new(message: text_message, nickname: message_params[:nickname])

    respond_to do |format|
      if @message.save
        Pusher['presence-room1'].trigger('new_message', {
          message: @message.message,
          nickname: @nickname,
          time: @message.created_at.to_formatted_s(:short)
        })
    
    
        format.html { redirect_to @message, notice: 'Message was successfully created.' }
        format.json { render action: 'show', status: :created, location: @message }
        format.js
      else
        format.html { render action: 'new' }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def process_message message
      processed_message = strip_tags(message)
      if processed_message.match(/\A(http|www).*(jpeg|jpg|gif|png)\Z/)
          
          processed_message = tag("img", src: processed_message.match(/\A(http|www).*(jpeg|jpg|gif|png)\Z/)[0], class:'chat-image', style:'max-height:200px;')
      else
          processed_message = auto_link(message, :html => { target: '_blank' })
      end
      
      
      processed_message
  end

 
  def erase_drawing
    
        
        @nickname ||= session[:nickname]
        
        Drawing.delete_all
        
        Pusher['presence-room1'].trigger('clear_canvas', {
          nickname: @nickname
        })
        
        render nothing: true
  end
  
  def add_drawing_element
      @drawing = params.require(:element).permit(:coords, :nickname, :color)
      
     
      Drawing.create(nickname: @drawing[:nickname], color: @drawing[:color], coords: params[:element][:coords][:points].to_json)
      
      render nothing: true
      
  end
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def message_params
      params.require(:message).permit(:message, :nickname)
    end
end
