class CreateDrawings < ActiveRecord::Migration
  def change
    create_table :drawings do |t|
      t.text :coords
      t.string :color
      t.string :nickname

      t.timestamps
    end
  end
end
