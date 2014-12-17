<?php

namespace app\modules\thread\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;


/**
 * GallerySearch represents the model behind the search form about `app\models\Gallery`.
 */
class ThreadSearch extends \app\modules\thread\models\Thread
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['author_id','responsible_id','state','priority','time_from','time_till', 'subject'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Thread::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);


        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }

        $query->andFilterWhere([
            'author_id' => $this->author_id,
            'responsible_id' => $this->responsible_id,
            'state' => $this->state,
            'priority' => $this->priority,
            'time_till' => $this->time_till,
            'time_form' => $this->time_from,
        ]);
        $query->andFilterWhere(['like', 'subject', $this->subject]);
//        $query->andFilterWhere(['in', 'subject', $this->subject]);

        // \yii\helpers\VarDumper::dump($dataProvider, 10, true);
        return $dataProvider;
    }
}
