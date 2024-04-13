const ApiError = require("../error/ApiError");
const { Order, BasketItem, User, Item, Basket } = require("../models/models");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const managerChatId = process.env.MANAGER_CHAT_ID;

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { userId, items } = req.body;

      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      let basket = await Basket.findOne({ where: { userId: user.id } });
      if (!basket) {
        basket = await Basket.create({ userId: user.id });
      }

      let totalPrice = 0;
      const products = [];

      for (const item of items) {
        const product = await Item.findOne({ where: { id: item.id } });
        if (product) {
          totalPrice += product.price * item.count;
          products.push({ ...product.dataValues, quantity: item.count }); // Добавляем в массив полную информацию о товаре и его количество
        }
      }

      const order = await Order.create({
        userId,
        totalPrice: items.reduce((total, item) => total + item.total, 0),
      });
      console.log(products);
      for (const item of items) {
        await BasketItem.create({
          basketId: basket.id,
          itemId: item.id,
          quantity: item.count,
          price: item.price, // Цена за единицу
          total: item.total, // Общая стоимость
        });
      }

      // Отправка данных заказа в Telegram-канал менеджера
      const orderMessage = `
			<strong>Новый заказ #${order.id}</strong>
			<strong>Пользователь:</strong> ${user.name} (${user.email})
			<strong>Телефон:</strong> ${user.phone}

Товары:
${products
  .map(
    (product) =>
      `Артикул: <strong>${product.code}</strong>
<strong>${product.name}</strong> 
<strong>${product.quantity} шт.</strong> по ${
        product.price
      } руб. (Итого: <strong>${
        product.quantity * product.price
      }</strong> руб.)\n`,
  )
  .join("\n")}`;

      await bot.sendMessage(managerChatId, orderMessage, {
        parse_mode: "HTML",
      });

      res.json(order);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getOrderDetails(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        where: { id },
        include: [
          {
            model: BasketItem,
            include: [{ model: Item }],
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Заказ не найден" });
      }

      res.json(order);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new OrderController();
