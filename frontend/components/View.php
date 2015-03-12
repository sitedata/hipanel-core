<?php

namespace frontend\components;

use Yii;

class View extends \yii\web\View
{
    public function init() {
        parent::init();
        $this->setTheme();
    }

    /**
     * @throws \yii\base\InvalidConfigException
     */
    public function setTheme() {
        $theme = Yii::$app->session->get('user.theme', Yii::$app->params['skin']['default-theme']);
        $this->theme = Yii::createObject([
            'class' => '\yii\base\Theme',
            'pathMap' => ['@app/views' =>'@app/themes/'.$theme],
            'baseUrl' => '@web/themes/'.$theme,
        ]);
    }
}