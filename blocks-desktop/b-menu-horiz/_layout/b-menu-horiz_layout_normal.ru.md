Входные данные для блока с любым из этих модификаторов похожи: нужно описать блок, модификатор `layout`, в качестве свойства `content` блока перечислить пункты меню, которые выражаются элементами `item`:

```js
{
  block: 'b-menu-horiz',
  mods: { layout: 'normal' },
  content: [
    {
      elem: 'item',
      content: 'Home'
    },
    {
      elem: 'item',
      content: 'Office'
    },
    ...
  ]
}
```

Содержанием элементов меню может быть что угодно: ссылки на страницы, псевдоссылки, иконки и вообще любые блоки. В примере выше каждый пункт меню — это просто строка текста.

Такое же меню со ссылками будет выглядеть следующим образом:

```js
{
  block: 'b-menu-horiz',
  mods: { layout: 'normal' },
  content: [
    {
      elem: 'item',
      content: {
        block: 'b-link', url: '/', content: 'Home'
      }
    },
    {
      elem: 'item',
      content: {
        block: 'b-link', url: '/office', content: 'Office'
      }
    },
    ...
  ]
}
```


Кроме того, у одного из пунктов меню может быть указан модификатор `{ state: 'current' }`, этот модификатор помечает текущий пункт меню.

На своём уровне переопределения можно реализовать для такого модификатора **CSS** правила, по которым текущий пункт меню будет визуально отличаться от остальных.

У меню также может быть необязательное свойство `title`, содержащее описание элемента `title` — заголовка меню.

Для меню с заголовком **BEMJSON** будет такой:

```js
{
  block: 'b-menu-horiz',
  mods: { layout: 'normal' },
  title: {
    elem: 'title', content: 'Navigation:'
  },
  content: [
    {
      elem: 'item',
      elemMods: { state: 'current' },
      content: {
        block: 'b-link', url: '/', content: 'Home'
      }
    },
    {
      elem: 'item',
      content: {
        block: 'b-link', url: '/office', content: 'Office'
      }
    },
    ...
  ]
}
```

#### Горизонтальное меню с клиентской функциональностью

Не всегда меню на сайте подразумевает ссылки, уводящие пользователя на другую страницу. Меню может использоваться и для клиентского **JavaScript**-приложения.
В этом случае содержанием пунктов меню обычно бывают псевдоссылки:

```js
{
  block: 'b-menu-horiz',
  mods: { layout: 'normal' },
  title: {
    elem: 'title', content: 'Navigation:'
  },
  content: [
    {
      elem: 'item',
      elemMods: { state: 'current' },
      content: {
        block: 'b-link',
        mods: { pseudo: 'yes' },
        url: '/',
        content: 'Home'
      }
    },
    {
      elem: 'item',
      content: {
        block: 'b-link',
        mods: { pseudo: 'yes' },
        url: '/office',
        content: 'Office'
      }
    },
    ...
  ]
}
```


Приведённый выше **BEMJSON** блока обеспечит нужный внешний вид.

Кроме этого нужно, чтобы у меню были области, реагирующие на клик. В данном случае они совпадают с псевдоссылками, поэтому можно применить смешивание блоков (`mix`):

```js
{
  block: 'b-menu-horiz',
  mods: { layout: 'normal' },
  title: {
    elem: 'title', content: 'Navigation:'
  },
  content: [
    {
      elem: 'item',
      elemMods: { state: 'current' },
      content: {
        block: 'b-link',
        mods: { pseudo: 'yes' },
        mix: [{ block: 'b-menu-horiz', elem : 'item-selector' }],
        url: '/',
        content: 'Home'
      }
    },
    {
      elem: 'item',
      content: {
        block: 'b-link',
        mods: { pseudo: 'yes' },
        mix: [{ block: 'b-menu-horiz', elem : 'item-selector' }],
        url: '/office',
        content: 'Office'
      }
    },
    ...
  ]
}
```


**JavaScript**-код блока реализован так, что активный пункт меню переключается при клике левой кнопкой мыши на соответствующем элементе `item-selector`.

При явном использовании этот элемент представлен в **DOM** в виде `span`, в который можно положить блоки, составляющие пункт меню. Если же содержание пункта меню состоит всего из
одного блока (как в примере с псевдоссылками), для экономии разметки разумно применять `mix`.

Кроме того, что соответствующий элемент `item` в результате клика приобретает модификатор `{ state: 'current' }`, на **BEM**-объекте блока возникает событие `current`, сопровождающееся данными о текущем и предыдущем активных пунктах.
В своём **JavaScript**-приложении можно реагировать на это событие.

В **HTML** по умолчанию блок представлен как имеющий **JavaScript**-реализацию (он смешан с блоком `i-bem` и
имеет соответствующие параметры в атрибуте `data-bem`). Но если в блоке отсутствуют элементы `item-selector`, **BEM**-объект блока не создаётся.

#### Меню без подмешивания блока i-bem

```js
{
  block: 'b-menu-horiz',
  js: false,
  mods: { layout: 'normal' },
  content: [
    {
      elem: 'item',
      content: {
        block: 'b-link', url: '/', content: 'Home'
      }
    },
    {
      elem: 'item',
      content: {
        block: 'b-link', url: '/office', content: 'Office'
      }
    },
    ...
  ]
}
```


Примешивание блока `i-bem` можно устранить, указав в свойстве `js` блока значение `false`.
