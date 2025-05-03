require: slotfilling/slotFilling.sc
  module = sys.zb-common
theme: /

    state: Start
        q!: $regex</start>
        a: Добро пожаловать в Motivation, ты можешь получить цитаты величайших мыслителей!

    state: ПовторитьЦитату
        q!: (повтори|озвучь) цитату
        
        script:
            $response.replies = $response.replies || []
            var body = {
                items: [{
                    command: {
                        type: "smart_app_data",
                        action: {
                            type: "repeat_quote"
                        }
                    }
                }]
            };
            $response.replies.push({ type: "raw", body: body });

    state: ОзвучиваниеЦитаты
        event!: VOICE
        if: $request.data.eventData.text
            a: {{$request.data.eventData.text}} {{$request.data.eventData.au_text}}
        else:
            a: Не могу повторить.

    
    state: ПолучитьЦитату
        q!: (новая) цитата
        a: Вот новая цитата.

        script:
            $response.replies = $response.replies || []
            var body = {
                items: [{
                    command: {
                        type: "smart_app_data",
                        action: {
                            type: "next_quote"
                        }
                    }
                }]
            };
            $response.replies.push({ type: "raw", body: body });

        
        
    state: Fallback
        event!: noMatch
        a: Вы сказали: {{$parseTree.text}}