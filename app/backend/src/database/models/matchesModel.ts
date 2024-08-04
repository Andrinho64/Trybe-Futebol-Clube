import { Model, DataTypes } from 'sequelize';
import db from '.';
import Teams from './teamModel';

class Matches extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Matches.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    field: 'home_team_id',
    allowNull: false,
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    references: { model: Teams, key: 'id' },
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    field: 'home_team_goals',
    allowNull: false,
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    field: 'away_team_id',
    allowNull: false,
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    references: { model: Teams, key: 'id' },
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    field: 'away_team_goals',
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    field: 'in_progress',
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'Matches',
  tableName: 'matches',
  timestamps: false,
});

Matches.belongsTo(Teams, { foreignKey: 'home_team_id', targetKey: 'id', as: 'homeTeam' });
Matches.belongsTo(Teams, { foreignKey: 'away_team_id', targetKey: 'id', as: 'awayTeam' });

Teams.hasMany(Matches, { foreignKey: 'home_team_id', as: 'matchHome' });
Teams.hasMany(Matches, { foreignKey: 'away_team_id', as: 'matchAway' });

export default Matches;
