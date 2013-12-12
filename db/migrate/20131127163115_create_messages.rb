class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :message
      t.string :nickname

      t.timestamps
    end
  end
end
