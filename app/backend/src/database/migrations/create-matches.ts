import { DataTypes, Model, QueryInterface } from "sequelize"

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<{
      id: number,
      away_team_goals: number,
      away_team_id: number,
      home_team_id: number,
      home_team_goals: number,
      in_progress: boolean
    }>>('matches', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      home_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        },
        field: 'home_team_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      home_team_goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      away_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        },
        field: 'away_team_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      away_team_goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      in_progress: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    });
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('matches');
  },
}
