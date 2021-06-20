SET FOREIGN_KEY_CHECKS = 0;
drop table guest;
drop table trip;
drop table booking;
drop table storno;
SET FOREIGN_KEY_CHECKS = 1;

create table guest
(
    id         int          not null AUTO_INCREMENT,
    first_name VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci not null,
    last_name  VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci not null,
    age        int          not null,
    primary key (id)
) CHARACTER SET utf8mb4;

create table trip
(
    id          int           not null AUTO_INCREMENT,
    type        VARCHAR(255)  CHARACTER SET utf8 COLLATE utf8_general_ci not null,
    description VARCHAR(5000) CHARACTER SET utf8 COLLATE utf8_general_ci not null,
    price       DECIMAL(8, 2) null,
    start_date  date          not null,
    start_time  time          not null,
    end_date    date          not null,
    end_time    time          not null,
    primary key (id)
) CHARACTER SET utf8mb4;

create table booking
(
    id    int not null AUTO_INCREMENT,
    trip  int,
    guest int,
    primary key (id),
    FOREIGN KEY (trip) REFERENCES trip (id),
    FOREIGN KEY (guest) REFERENCES guest (id)
) CHARACTER SET utf8mb4;

create table storno
(
    id    int not null AUTO_INCREMENT,
    trip  int,
    guest int,
    primary key (id),
    FOREIGN KEY (trip) REFERENCES trip (id),
    FOREIGN KEY (guest) REFERENCES guest (id)
) CHARACTER SET utf8mb4;