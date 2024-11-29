

module.exports = {
    dialect: 'postgres',
    url: 'postgresql://postgres:hlqoWkxDeBIXBWavXWkSIcRaVrDkloCd@autorack.proxy.rlwy.net:42445/railway',
    /**
     * trocado config após deploy com railway
        host: 'localhost',
        username: 'postgres',
        password: 'postgres',
        database: 'BaseEcomerce',
         */
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
}