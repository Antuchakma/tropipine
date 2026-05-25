const { prisma } = require('../config/db');

async function getAddresses(req, res) {
  try {
    const userId = req.user?.id;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ data: addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function addAddress(req, res) {
  try {
    const userId = req.user?.id;
    const { label, fullName, phone, street, city, district, postalCode, isDefault } = req.body;

    if (!fullName || !phone || !street || !city || !district) {
      return res.status(400).json({ message: 'fullName, phone, street, city, and district are required' });
    }

    // If setting as default, unset others first
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label: label || 'Home',
        fullName,
        phone,
        street,
        city,
        district,
        postalCode: postalCode || null,
        isDefault: isDefault === true || isDefault === 'true',
      },
    });
    res.status(201).json({ data: address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateAddress(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Address not found' });

    const { label, fullName, phone, street, city, district, postalCode } = req.body;
    const data = {};
    if (label !== undefined) data.label = label;
    if (fullName !== undefined) data.fullName = fullName;
    if (phone !== undefined) data.phone = phone;
    if (street !== undefined) data.street = street;
    if (city !== undefined) data.city = city;
    if (district !== undefined) data.district = district;
    if (postalCode !== undefined) data.postalCode = postalCode;

    const address = await prisma.address.update({ where: { id }, data });
    res.json({ data: address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function setDefaultAddress(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Address not found' });

    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    const address = await prisma.address.update({ where: { id }, data: { isDefault: true } });
    res.json({ data: address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteAddress(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Address not found' });

    await prisma.address.delete({ where: { id } });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAddresses, addAddress, updateAddress, setDefaultAddress, deleteAddress };
